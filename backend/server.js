const express = require('express');
const cors = require('cors');
require('dotenv').config();
const aiUtils = require('./lib/aiUtils');
const notesService = require('./lib/notesService');
const chrono = require('chrono-node');
const path = require('path');
const GoogleCalendarService = require('./lib/googleCalendarService');

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
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await notesService.getAllNotes();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const { content, color, timezone } = req.body;
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
      // Continue with note creation even if duplicate check fails
    }
    
    const newNote = {
      id: Date.now().toString(),
      content,
      color: color || '#ffffff',
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
          // default to 1 hour event if end not provided
          const endDate = first.end ? first.end.date() : new Date(startDate.getTime() + 60 * 60 * 1000);
          
          try {
            const summary = (content || '').split('\n')[0].slice(0, 100) || 'Reminder from Note';
            const description = `Note: ${content}\nNote ID: ${savedNote.id}`;
            
            const event = await googleCal.createEvent({
              summary,
              description,
              startDate,
              endDate,
              timezone: timezone || 'UTC'
            });

            if (event && event.id) {
              try {
                const updateData = {
                  calendarEventId: event.id,
                  calendarEventUrl: event.htmlLink || null
                };
                
                // Add duplicate flag if event already existed
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

    // Fetch and return the updated note with calendar info
    const finalNote = await notesService.getNoteById(savedNote.id);
    res.status(201).json(finalNote || savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const updatedNote = await notesService.updateNote(noteId, { content });
    res.json(updatedNote);
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