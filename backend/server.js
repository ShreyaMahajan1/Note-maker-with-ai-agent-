const express = require('express');
const cors = require('cors');
require('dotenv').config();
const aiUtils = require('./lib/aiUtils');
const notesService = require('./lib/notesService');
const chrono = require('chrono-node');
const path = require('path');
const GoogleCalendarService = require('./lib/googleCalendarService');
const { google } = require("googleapis");
const app = express();
const port = process.env.PORT || 5000;

// Initialize Google Calendar service
const googleCal = new GoogleCalendarService({ backendDir: path.resolve(__dirname) });

// In-memory storage for notes (in a real app, you'd use a database)
let notes = [];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Notes endpoints
// app.get('/api/notes', async (req, res) => {
//   try {
//     const notes = await notesService.getAllNotes();
//     res.json(notes);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch notes' });
//   }
// });

// In your POST /api/notes endpoint, update the newNote object:

// POST /api/notes endpoint - ADD notesLink parameter
app.post('/api/notes', async (req, res) => {
  try {
    const { content, color, timezone, link } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Check for duplicate BEFORE creating note
    try {
      const results = chrono.parse(content || '');
      if (results && results.length > 0 && googleCal.isAuthorized()) {
        const first = results[0];
        const startDate = first.start ? first.start.date() : null;
        
        if (startDate) {
          const endDate = first.end ? first.end.date() : new Date(startDate.getTime() + 60 * 60 * 1000);
          const summary = (content || '').split('\n')[0].slice(0, 100) || 'Reminder from Note';
          
          const isDuplicate = await googleCal.eventExists({ summary, startDate, endDate });
          if (isDuplicate) {
            return res.status(409).json({ 
              error: 'Event already exists on calendar',
              isDuplicate: true,
              calendarEventUrl: isDuplicate.htmlLink || null
            });
          }
        }
      }
    } catch (checkErr) {
      console.warn('Error checking for duplicate:', checkErr.message);
    }
    
    const newNote = {
      id: Date.now().toString(),
      content,
      color: color || '#ffffff',
      link: link?.trim() || null,
      createdAt: new Date().toISOString()
    };
    
    const savedNote = await notesService.addNote(newNote);

    // Parse date/time from note content using chrono-node
    try {
      const results = chrono.parse(content || '');
      if (results && results.length > 0) {
        const first = results[0];
        const startDate = first.start ? first.start.date() : null;
        
        if (startDate && googleCal.isAuthorized()) {
          const endDate = first.end ? first.end.date() : new Date(startDate.getTime() + 60 * 60 * 1000);
          
          try {
            const summary = (content || '').split('\n')[0].slice(0, 100) || 'Reminder from Note';
            const description = `Note: ${content}\nNote ID: ${savedNote.id}`;
            
            // ⭐ ADD notesLink parameter here
            const event = await googleCal.createEvent({
              summary,
              description,
              startDate,
              endDate,
              timezone: timezone || 'UTC',
              notesLink: link?.trim() || null  // 🔥 PASS THE LINK HERE
            });

            if (event && event.id) {
              try {
                const updateData = {
                  calendarEventId: event.id,
                  calendarEventUrl: event.htmlLink || null
                };
                
                if (event.isDuplicate) {
                  updateData.isDuplicate = true;
                }
                
                await notesService.updateNote(savedNote.id, updateData);
              } catch (uErr) {
                console.warn('Failed to persist calendar event info on note:', uErr.message || uErr);
              }
            }
          } catch (gErr) {
            console.warn('Google Calendar create event failed:', gErr.message || gErr);
          }
        }
      }
    } catch (parseErr) {
      console.warn('Date parse error:', parseErr);
    }

    const finalNote = await notesService.getNoteById(savedNote.id);
    res.status(201).json(finalNote || savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// PUT /api/notes/:id endpoint - ADD notesLink parameter
app.put('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const { content, link } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const updatedNote = await notesService.updateNote(noteId, { 
      content,
      link: link?.trim() || null
    });
    
    try {
      const finalNote = await notesService.getNoteById(noteId);
      if (finalNote && finalNote.calendarEventId && googleCal.isAuthorized()) {
        try {
          const summary = (finalNote.content || '').split('\n')[0].slice(0, 100) || 'Reminder from Note';
          const description = `Note: ${finalNote.content}\nNote ID: ${finalNote.id}`;

          const results = chrono.parse(finalNote.content || '');
          let startDate = null;
          let endDate = null;
          if (results && results.length > 0) {
            const first = results[0];
            startDate = first.start ? first.start.date() : null;
            endDate = first.end ? first.end.date() : (startDate ? new Date(startDate.getTime() + 60 * 60 * 1000) : null);
          }

          // ⭐ ADD notesLink parameter here
          const updatedEvent = await googleCal.updateEvent(finalNote.calendarEventId, {
            summary,
            description,
            startDate,
            endDate,
            timezone: req.body.timezone || 'UTC',
            notesLink: link?.trim() || null  // 🔥 PASS THE LINK HERE
          });

          if (updatedEvent && updatedEvent.id) {
            await notesService.updateNote(noteId, {
              calendarEventId: updatedEvent.id,
              calendarEventUrl: updatedEvent.htmlLink || finalNote.calendarEventUrl || null,
            });
          }
        } catch (gErr) {
          console.warn('Google Calendar update failed for edited note:', gErr.message || gErr);
        }
      }
    } catch (fetchErr) {
      console.warn('Failed to fetch note after update for calendar sync:', fetchErr.message || fetchErr);
    }

    const final = await notesService.getNoteById(noteId);
    res.json(final || updatedNote);
  } catch (error) {
    if (error.message === 'Note not found') {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.status(500).json({ error: 'Failed to update note' });
    }
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    // Fetch note to see if it has an associated Google Calendar event
    const note = await notesService.getNoteById(noteId);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // If the note has a calendarEventId and Google Calendar is authorized, attempt to delete the event
    if (note.calendarEventId && googleCal.isAuthorized()) {
      try {
        await googleCal.deleteEvent(note.calendarEventId);
      } catch (err) {
        console.warn('Failed to delete associated Google Calendar event:', err.message || err);
        // Continue deleting the note locally even if calendar deletion fails
      }
    }

    await notesService.deleteNote(noteId);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Note not found') {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete note' });
    }
  }
});

// AI Routes
app.post('/api/ai/suggest', async (req, res) => {
  try {
    const { prompt } = req.body;
    const { suggestion, error } = await aiUtils.generateNoteSuggestion(prompt);
    if (error) return res.status(500).json({ error });
    res.json({ suggestion });
  } catch (error) {
    console.error('AI suggest error:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to generate suggestion' });
  }
});

app.post('/api/ai/categorize', async (req, res) => {
  try {
    const { content } = req.body;
    const { category, error } = await aiUtils.categorizeNote(content);
    if (error) return res.status(500).json({ error });
    res.json({ category });
  } catch (error) {
    console.error('AI categorize error:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to categorize note' });
  }
});

app.post('/api/ai/enhance', async (req, res) => {
  try {
    const { content } = req.body;
    const { enhanced, error } = await aiUtils.enhanceNote(content);
    if (error) return res.status(500).json({ error });
    res.json({ enhanced });
  } catch (error) {
    console.error('AI enhance error:', error.message || error);
    res.status(500).json({ error: error.message || 'Failed to enhance note' });
  }
});

// Initialize services on startup
notesService.initialize().catch(console.error);
aiUtils.initialize()
  .then((ok) => console.log('✅ AI service initialized:', ok))
  .catch((err) => console.error('⚠️ AI init warning:', err.message));

// Google Calendar OAuth routes
app.get('/auth/google', (req, res) => {
  try {
    const url = googleCal.generateAuthUrl();
    return res.redirect(url);
  } catch (err) {
    console.error('Auth URL generation failed', err);
    return res.status(500).send('Google credentials not configured on server.');
  }
});

app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Missing authorization code');
  try {
    await googleCal.handleOAuthCallback(code);
    res.send(`
      <html>
        <head>
          <title>Google Calendar Connected</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
            .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); text-align: center; max-width: 500px; }
            h1 { color: #4CAF50; margin: 0 0 10px 0; }
            p { color: #666; font-size: 16px; line-height: 1.6; }
            .button { background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px; text-decoration: none; display: inline-block; }
            .button:hover { background: #764ba2; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Success!</h1>
            <p>Google Calendar connected successfully!</p>
            <p>The button in your app should now show "✓ Google Calendar Connected"</p>
            <p>You can now add notes with dates/times (like "Meeting tomorrow at 5pm") and they'll automatically create calendar events with reminders.</p>
            <button class="button" onclick="window.close()">Close this window</button>
            <p style="margin-top: 30px; font-size: 14px; color: #999;">If the window doesn't close, you can safely close it manually.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('OAuth callback error', err);
    res.status(500).send('Failed to complete OAuth exchange: ' + err.message);
  }
});

// Endpoint to check Google Calendar authorization status
app.get('/api/google/status', (req, res) => {
  try {
    res.json({ authorized: googleCal.isAuthorized() });
  } catch (err) {
    res.status(500).json({ authorized: false, error: err.message || err });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});

// Add this route to your server.js file

// Get calendar events (add this with your other Google Calendar routes)
// Get Google Calendar events
app.get('/api/google/calendar/events', async (req, res) => {
  try {
    // Check auth
    if (
      !googleCal.oauth2Client.credentials ||
      !googleCal.oauth2Client.credentials.access_token
    ) {
      return res.status(401).json({ error: 'Not authenticated with Google' });
    }

    const calendar = google.calendar({
      version: 'v3',
      auth: googleCal.oauth2Client
    });

    const { timeMin, timeMax } = req.query;

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin || new Date().toISOString(),
      timeMax:
        timeMax ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];

    res.json({
      events: events.map((e) => ({
        id: e.id,
        summary: e.summary || 'No title',
        description: e.description,
        start: e.start,
        end: e.end,
        location: e.location,
        htmlLink: e.htmlLink
      }))
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({
      error: 'Failed to fetch calendar events',
      details: error.message
    });
  }
});


// Also update your existing notes route to include calendar event data
// Modify the GET /api/notes route to include calendar event info
app.get('/api/notes', async (req, res) => {
  try {
    // Fetch all notes from DB
    const notes = await notesService.getAllNotes();

    // If Google Calendar is not authorized, just return notes
    if (!googleCal.oauth2Client.credentials?.access_token) {
      return res.json(notes);
    }

    // Create calendar client
    const { google } = require("googleapis");
    const calendar = google.calendar({
      version: "v3",
      auth: googleCal.oauth2Client
    });

    // Fetch the last 90 days of events
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      maxResults: 500,
      singleEvents: true,
      orderBy: "startTime"
    });

    const calendarEvents = response.data.items || [];

    // Match notes → calendar events by summary
    const enrichedNotes = notes.map((note) => {
      const match = calendarEvents.find((event) => {
        const title = event.summary?.toLowerCase() || "";
        const snippet = (note.content || "").toLowerCase().substring(0, 50);
        return title.includes(snippet);
      });

      if (match) {
        return {
          ...note,
          calendarEventId: match.id,
          calendarEventUrl: match.htmlLink || null,
          eventStart: match.start,
          eventEnd: match.end
        };
      }

      return note;
    });

    res.json(enrichedNotes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});
