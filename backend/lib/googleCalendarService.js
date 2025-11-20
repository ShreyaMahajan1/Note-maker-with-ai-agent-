// const fs = require('fs');
// const path = require('path');
// const { google } = require('googleapis');

// class GoogleCalendarService {
//   constructor({ backendDir }) {
//     this.backendDir = backendDir;
//     this.credentialsPath = path.join(backendDir, 'credentials.json');
//     this.tokenPath = path.join(backendDir, 'token.json');
//     this.oauth2Client = null;
//     this.calendar = null;
    
//     this._initClient();
//   }

//   _initClient() {
//     try {
//       if (!fs.existsSync(this.credentialsPath)) {
//         console.warn('⚠️  credentials.json not found at', this.credentialsPath);
//         return;
//       }

//       const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
//       const credentialsData = credentials.installed || credentials.web;
//       const { client_id, client_secret, redirect_uris } = credentialsData;

//       this.oauth2Client = new google.auth.OAuth2(
//         client_id,
//         client_secret,
//         redirect_uris[0]
//       );

//       // Try to load existing token
//       if (fs.existsSync(this.tokenPath)) {
//         const token = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
//         this.oauth2Client.setCredentials(token);
//         this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
//         console.log('✅ Google Calendar service initialized with existing token');
//       } else {
//         console.log('ℹ️  No token.json found. OAuth2 flow required.');
//       }
//     } catch (error) {
//       console.error('Error initializing Google Calendar service:', error.message);
//     }
//   }

//   generateAuthUrl() {
//     if (!this.oauth2Client) {
//       throw new Error('OAuth2 client not initialized');
//     }
//     return this.oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: ['https://www.googleapis.com/auth/calendar']
//     });
//   }

//   async handleOAuthCallback(code) {
//     if (!this.oauth2Client) {
//       throw new Error('OAuth2 client not initialized');
//     }

//     const { tokens } = await this.oauth2Client.getToken(code);
//     this.oauth2Client.setCredentials(tokens);
//     fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
//     this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
//     console.log('✅ OAuth token saved and calendar service initialized');
//   }

//   isAuthorized() {
//     return this.calendar !== null && this.oauth2Client !== null;
//   }

//   async eventExists({ summary, startDate, endDate }) {
//     if (!this.isAuthorized()) {
//       return false;
//     }

//     try {
//       // Search for events with same summary in a 1-hour window around the event time
//       const response = await this.calendar.events.list({
//         calendarId: 'primary',
//         q: summary,
//         timeMin: new Date(startDate.getTime() - 60 * 60 * 1000).toISOString(),
//         timeMax: new Date(endDate.getTime() + 60 * 60 * 1000).toISOString(),
//         maxResults: 10
//       });

//       const events = response.data.items || [];
      
//       // Check for exact matches (same summary and similar time window)
//       const exactMatch = events.find(event => {
//         return event.summary === summary;
//       });

//       return exactMatch || false;
//     } catch (error) {
//       console.warn('Error checking for duplicate events:', error.message);
//       return false;
//     }
//   }

//   async createEvent({ summary, description, startDate, endDate, timezone, notesLink }) {
//     if (!this.isAuthorized()) {
//       throw new Error('Google Calendar not authorized');
//     }

//     try {
//       // Check for duplicate events
//       const isDuplicate = await this.eventExists({ summary, startDate, endDate });
//       if (isDuplicate) {
//         console.log('⚠️  Event already exists - skipping duplicate creation');
//         return {
//           id: isDuplicate.id,
//           htmlLink: isDuplicate.htmlLink,
//           isDuplicate: true,
//           message: 'Event already exists on calendar'
//         };
//       }

//       // Build description with notes link if provided
//       let eventDescription = description || '';
//       if (notesLink) {
//         if (eventDescription) {
//           eventDescription += '\n\n';
//         }
//         eventDescription += `📝 Notes: ${notesLink}`;
//       }

//       const event = {
//         summary,
//         description: eventDescription,
//         start: {
//           dateTime: startDate.toISOString(),
//           timeZone: timezone || 'UTC'
//         },
//         end: {
//           dateTime: endDate.toISOString(),
//           timeZone: timezone || 'UTC'
//         },
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'popup', minutes: 15 }
//           ]
//         }
//       };

//       const response = await this.calendar.events.insert({
//         calendarId: 'primary',
//         resource: event
//       });

//       console.log('✅ Google Calendar event created:', response.data.id);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to create Google Calendar event:', error.message);
//       throw error;
//     }
//   }

//   async deleteEvent(eventId) {
//     if (!this.isAuthorized()) {
//       throw new Error('Google Calendar not authorized');
//     }

//     try {
//       await this.calendar.events.delete({
//         calendarId: 'primary',
//         eventId,
//       });
//       console.log('✅ Google Calendar event deleted:', eventId);
//       return true;
//     } catch (error) {
//       console.error('Failed to delete Google Calendar event:', error.message);
//       throw error;
//     }
//   }

//   async updateEvent(eventId, { summary, description, startDate, endDate, timezone, notesLink }) {
//     if (!this.isAuthorized()) {
//       throw new Error('Google Calendar not authorized');
//     }

//     try {
//       // Fetch existing event
//       const existing = await this.calendar.events.get({ calendarId: 'primary', eventId });
//       const event = existing.data || {};

//       if (summary) event.summary = summary;
      
//       if (description !== undefined || notesLink !== undefined) {
//         let eventDescription = description || event.description || '';
        
//         // Remove existing notes link if present
//         eventDescription = eventDescription.replace(/\n\n📝 Notes:.*$/s, '');
        
//         // Add new notes link if provided
//         if (notesLink) {
//           if (eventDescription) {
//             eventDescription += '\n\n';
//           }
//           eventDescription += `📝 Notes: ${notesLink}`;
//         }
        
//         event.description = eventDescription;
//       }

//       if (startDate) {
//         event.start = {
//           dateTime: startDate.toISOString(),
//           timeZone: timezone || (event.start && event.start.timeZone) || 'UTC'
//         };
//       }

//       if (endDate) {
//         event.end = {
//           dateTime: endDate.toISOString(),
//           timeZone: timezone || (event.end && event.end.timeZone) || 'UTC'
//         };
//       }

//       const response = await this.calendar.events.update({
//         calendarId: 'primary',
//         eventId,
//         resource: event,
//       });

//       console.log('✅ Google Calendar event updated:', response.data.id);
//       return response.data;
//     } catch (error) {
//       console.error('Failed to update Google Calendar event:', error.message || error);
//       throw error;
//     }
//   }
// }

// module.exports = GoogleCalendarService;
// GoogleCalendarService.js
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

class GoogleCalendarService {
  constructor({ backendDir }) {
    this.backendDir = backendDir;
    this.credentialsPath = path.join(backendDir, 'credentials.json');
    this.tokenPath = path.join(backendDir, 'token.json');
    this.oauth2Client = null;
    this.calendar = null;

    this._initClient();
  }

  _initClient() {
    try {
      if (!fs.existsSync(this.credentialsPath)) {
        console.warn('⚠️ credentials.json not found at', this.credentialsPath);
        return;
      }

      const credentials = JSON.parse(fs.readFileSync(this.credentialsPath, 'utf8'));
      const creds = credentials.installed || credentials.web;

      this.oauth2Client = new google.auth.OAuth2(
        creds.client_id,
        creds.client_secret,
        creds.redirect_uris[0]
      );

      if (fs.existsSync(this.tokenPath)) {
        const token = JSON.parse(fs.readFileSync(this.tokenPath, 'utf8'));
        this.oauth2Client.setCredentials(token);
        this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
        console.log('✅ Google Calendar initialized with existing token');
      } else {
        console.log('ℹ️ No token.json found. OAuth2 login required.');
      }
    } catch (error) {
      console.error('Error initializing Google Calendar:', error.message);
    }
  }

  isAuthorized() {
    return this.calendar !== null && this.oauth2Client !== null;
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar']
    });
  }

  async handleOAuthCallback(code) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    fs.writeFileSync(this.tokenPath, JSON.stringify(tokens));
    this.calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });
    console.log('✅ OAuth token saved');
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
