
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const Token = require('../models/Token');

class GoogleCalendarService {
  constructor({ backendDir }) {
    this.backendDir = backendDir;
    this.credentialsPath = path.join(backendDir, 'credentials.json');
    this.oauth2Client = null;
    this.calendar = null;

    this._initClient();
  }

  async _initClient() {
    try {
      if (!fs.existsSync(this.credentialsPath)) {
        console.warn('⚠️ credentials.json not found at', this.credentialsPath);
        return;
      }

      const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
      const creds = credentials.installed || credentials.web;

      // Use production redirect URI if in production, otherwise localhost
      const redirectUri = process.env.NODE_ENV === 'production' 
        ? creds.redirect_uris.find(uri => uri.includes('onrender.com')) || creds.redirect_uris[1]
        : creds.redirect_uris[0];

      console.log('🔧 Using OAuth redirect URI:', redirectUri);

      this.oauth2Client = new google.auth.OAuth2(
        creds.client_id,
        creds.client_secret,
        redirectUri
      );

      // Set up automatic token refresh
      this.oauth2Client.on('tokens', async (tokens) => {
        console.log('🔄 Token refreshed automatically');
        await this._saveTokenToDb(tokens);
      });

      // Try to load token from MongoDB
      try {
        const tokenDoc = await Token.findOne({ service: 'google_calendar' });
        if (tokenDoc) {
          const token = {
            access_token: tokenDoc.accessToken,
            refresh_token: tokenDoc.refreshToken,
            expiry_date: tokenDoc.expiryDate,
            scope: tokenDoc.scope,
            token_type: tokenDoc.tokenType,
          };
          this.oauth2Client.setCredentials(token);
          this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
          console.log('✅ Google Calendar initialized with token from MongoDB');
        } else {
          console.log('ℹ️ No token found in MongoDB. OAuth2 login required.');
        }
      } catch (dbError) {
        console.warn('⚠️ Could not load token from MongoDB:', dbError.message);
      }
    } catch (error) {
      console.error('Error initializing Google Calendar:', error.message);
    }
  }

  async _saveTokenToDb(tokens) {
    try {
      await Token.findOneAndUpdate(
        { service: 'google_calendar' },
        {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || undefined,
          expiryDate: tokens.expiry_date,
          scope: tokens.scope,
          tokenType: tokens.token_type,
        },
        { upsert: true, new: true }
      );
      console.log('✅ Token saved to MongoDB');
    } catch (error) {
      console.error('❌ Failed to save token to MongoDB:', error.message);
    }
  }

  isAuthorized() {
    return this.calendar !== null && this.oauth2Client !== null;
  }

  async checkTokenValidity() {
    if (!this.isAuthorized()) {
      return { valid: false, reason: 'not_authorized' };
    }

    try {
      // Try to make a simple API call to verify token
      await this.calendar.calendarList.list({ maxResults: 1 });
      return { valid: true };
    } catch (error) {
      console.error('Token validation failed:', error.message);
      
      // Check if it's an auth error
      if (error.code === 401 || error.message.includes('invalid') || error.message.includes('expired')) {
        // Clear the invalid token from MongoDB
        try {
          await Token.deleteOne({ service: 'google_calendar' });
          console.log('🗑️ Removed expired token from MongoDB');
        } catch (dbError) {
          console.warn('⚠️ Could not delete token from MongoDB:', dbError.message);
        }
        this.calendar = null;
        return { valid: false, reason: 'token_expired' };
      }
      
      return { valid: false, reason: 'unknown_error' };
    }
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
      prompt: 'select_account' // Force account selection every time
    });
  }

  async handleOAuthCallback(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    // Save to MongoDB instead of file
    await this._saveTokenToDb(tokens);
    
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    console.log('✅ OAuth token saved to MongoDB');
  }

  async eventExists({ summary, startDate, endDate }) {
    if (!this.isAuthorized()) return false;

    try {
      const response = await this.calendar.events.list({
        calendarId: 'primary',
        q: summary,
        timeMin: new Date(startDate.getTime() - 3600000).toISOString(),
        timeMax: new Date(endDate.getTime() + 3600000).toISOString(),
        maxResults: 10
      });

      return response.data.items.find(e => e.summary === summary) || false;
    } catch (err) {
      console.warn('Duplicate check failed:', err.message);
      return false;
    }
  }

  async createEvent({ summary, description, startDate, endDate, timezone, notesLink }) {
    if (!this.isAuthorized()) throw new Error('Not authorized');

    try {
      const duplicate = await this.eventExists({ summary, startDate, endDate });
      if (duplicate) {
        return { id: duplicate.id, htmlLink: duplicate.htmlLink, isDuplicate: true };
      }

      let eventDescription = description || "";
      if (notesLink) {
        eventDescription += `\n\n📝 Notes: ${notesLink}`;
      }

      const now = new Date();
      const isFuture = startDate > now;

      const event = {
        summary,
        description: eventDescription,
        start: { dateTime: startDate.toISOString(), timeZone: timezone || "UTC" },
        end: { dateTime: endDate.toISOString(), timeZone: timezone || "UTC" },

        // 🔥 Key logic → Only add reminders for future events
        reminders: isFuture
          ? { useDefault: false, overrides: [{ method: "popup", minutes: 15 }] }
          : { useDefault: false, overrides: [] }
      };

      const resp = await this.calendar.events.insert({
        calendarId: "primary",
        resource: event
      });

      return resp.data;
    } catch (error) {
      console.error("Create event error:", error.message);
      throw error;
    }
  }

  async updateEvent(eventId, { summary, description, startDate, endDate, timezone, notesLink }) {
    if (!this.isAuthorized()) throw new Error('Not authorized');

    try {
      const existing = await this.calendar.events.get({
        calendarId: "primary",
        eventId
      });

      const ev = existing.data;

      if (summary) ev.summary = summary;

      if (description !== undefined || notesLink !== undefined) {
        let desc = description || ev.description || "";
        desc = desc.replace(/\n\n📝 Notes:.*/s, "");
        if (notesLink) desc += `\n\n📝 Notes: ${notesLink}`;
        ev.description = desc;
      }

      if (startDate) {
        ev.start = {
          dateTime: startDate.toISOString(),
          timeZone: timezone || ev.start.timeZone || "UTC",
        };
      }

      if (endDate) {
        ev.end = {
          dateTime: endDate.toISOString(),
          timeZone: timezone || ev.end.timeZone || "UTC",
        };
      }

      const now = new Date();
      const ended = ev.end && new Date(ev.end.dateTime) <= now;

      // 🔥 If event already passed → remove reminders
      ev.reminders = ended
        ? { useDefault: false, overrides: [] }
        : ev.reminders || { useDefault: false, overrides: [{ method: "popup", minutes: 15 }] };

      const resp = await this.calendar.events.update({
        calendarId: "primary",
        eventId,
        resource: ev,
      });

      return resp.data;
    } catch (error) {
      console.error("Update error:", error.message);
      throw error;
    }
  }

  async deleteEvent(eventId) {
    await this.calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
    return true;
  }
}

module.exports = GoogleCalendarService;
