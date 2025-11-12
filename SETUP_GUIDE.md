# Google Calendar Integration with Notes App

## Overview
This is a complete full-stack notes application with automatic Google Calendar integration. When you add a note with a date/time (e.g., "Meeting tomorrow at 5pm"), the system automatically:

1. **Parses the date/time** from the note content using `chrono-node`
2. **Creates a Google Calendar event** with automatic reminders
3. **Stores the calendar link** on the note for quick access
4. **Shows the event status** on the note card in the UI

## Setup Instructions

### 1. Get Google Calendar API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Google Calendar API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Desktop Application**
6. Download the credentials as JSON
7. Save it as `/home/shreya/quadbtech/project/backend/credentials.json`

### 2. Authorize the App

1. Start the backend server:
   ```bash
   cd /home/shreya/quadbtech/project/backend
   node server.js
   ```

2. Start the frontend (in a new terminal):
   ```bash
   cd /home/shreya/quadbtech/project/frontend
   npm start
   ```

3. In the app, click the **"Connect Calendar"** button in the top right
4. This opens Google's authorization page
5. Grant permission to access your calendar
6. You'll be redirected back with a success message
7. A `token.json` file will be saved in the backend directory

### 3. Add Notes with Dates

Now when you add a note with a date/time, it will automatically:
- Parse the date (e.g., "tomorrow at 5pm", "next Monday at 3", "in 5 minutes")
- Create a Google Calendar event
- Add a 15-minute reminder notification
- Display a "Scheduled" badge on the note with a link to the event

## How It Works

### Backend Flow

1. **User adds a note** via POST `/api/notes` with `content` and optional `timezone`
2. **Date parsing** with `chrono-node` extracts date/time from the note content
3. **If Google Calendar is authorized**:
   - Creates an event via Google Calendar API
   - Includes 15-minute advance reminder
   - Stores `calendarEventId` and `calendarEventUrl` on the note
4. **Note is saved** with calendar metadata

### Frontend Flow

1. **Connect button** shows connection status
   - Gray: Not connected → Click to authorize
   - Green: ✓ Connected → Ready to create events
2. **Note card displays**:
   - Category badge (Work, Personal, Todo, etc.)
   - "Scheduled" badge with link to the Google Calendar event (if exists)
   - Calendar icon for quick access

## API Endpoints

### Notes
- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create note (automatically creates calendar event if date detected)
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Google Calendar
- `GET /auth/google` - Start OAuth authorization flow
- `GET /auth/google/callback` - OAuth callback endpoint
- `GET /api/google/status` - Check if Google Calendar is authorized

### Example: Create a note that becomes a calendar event

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Team meeting tomorrow at 2pm",
    "color": "#ffffff",
    "timezone": "America/New_York"
  }'
```

Response:
```json
{
  "id": "1234567890",
  "content": "Team meeting tomorrow at 2pm",
  "color": "#ffffff",
  "createdAt": "2025-11-11T10:00:00Z",
  "calendarEventId": "abc123xyz",
  "calendarEventUrl": "https://calendar.google.com/calendar/u/0/r/eventedit/abc123xyz",
  "updatedAt": "2025-11-11T10:00:05Z"
}
```

## Features Supported

### Date/Time Recognition
- "tomorrow at 5pm"
- "next Monday at 3:00"
- "in 5 minutes"
- "next Friday"
- "today at 2:30pm"
- "December 25 at 10am"
- And many more natural language formats!

### Calendar Features
- ✅ Automatic event creation when date is detected
- ✅ 15-minute advance notification reminders
- ✅ Quick link to view event in Google Calendar
- ✅ Event created with note content as description
- ✅ Timezone support

### UI Features
- ✅ Google Calendar connection status indicator
- ✅ "Scheduled" badge on notes with calendar events
- ✅ Click badge to open event in Google Calendar
- ✅ Automatic timezone detection
- ✅ Success messages when events are created

## Project Structure

```
project/
├── backend/
│   ├── server.js                 # Main Express server
│   ├── lib/
│   │   ├── googleCalendarService.js  # Google Calendar API wrapper
│   │   ├── notesService.js          # Notes persistence
│   │   └── aiUtils.js               # AI utilities
│   ├── credentials.json          # Google OAuth credentials (user-provided)
│   ├── token.json               # Google OAuth token (auto-generated after auth)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js               # Main React component
    │   ├── components/
    │   │   ├── VoiceControl.js  # Voice input
    │   │   └── AiDialog.js      # AI features
    │   └── App.css
    └── package.json
```

## Files Modified/Created

### Backend
- ✅ Created `backend/lib/googleCalendarService.js` - Google Calendar API integration
- ✅ Updated `backend/server.js`:
  - Added `chrono-node` for date parsing
  - Added Google Calendar initialization
  - Updated POST `/api/notes` to parse dates and create calendar events
  - Added OAuth routes (`/auth/google`, `/auth/google/callback`)
  - Added status endpoint (`/api/google/status`)

### Frontend
- ✅ Updated `frontend/src/App.js`:
  - Added Google authorization state tracking
  - Added "Connect Calendar" button to AppBar
  - Updated handleAddNote to send timezone
  - Added "Scheduled" badge with calendar link on notes
  - Auto-check authorization status on app load

## Troubleshooting

### Issue: "Google credentials not configured on server"
- **Solution**: Make sure `backend/credentials.json` exists with your OAuth credentials

### Issue: "OAuth token not working"
- **Solution**: Delete `backend/token.json` and re-authorize by clicking "Connect Calendar"

### Issue: Dates not being recognized
- **Solution**: Use natural language like "tomorrow", "next Monday", "in 5 minutes", "at 3pm"
- More examples: https://github.com/wanasit/chrono

### Issue: Events not appearing in Google Calendar
- **Solution**: Check that you authorized the app properly and Gmail account has Google Calendar enabled

## Example Usage Scenarios

### Scenario 1: Schedule a team meeting
```
User types: "Team sync meeting tomorrow at 10am"
Result: Calendar event created for tomorrow at 10am with 15-min reminder
UI: Note shows "Scheduled" badge linked to the Google Calendar event
```

### Scenario 2: Personal reminder
```
User types: "Dentist appointment next Friday at 2:30pm"
Result: Calendar event created for the date/time
UI: Green "Scheduled" badge appears on the note
```

### Scenario 3: Quick reminder
```
User types: "Call mom in 30 minutes"
Result: Calendar event created 30 minutes from now
UI: Note automatically gets "Scheduled" badge
```

## Security Notes

- `credentials.json` contains your OAuth client secret - keep it private
- `token.json` is generated locally and contains your Google Calendar access token
- Both files should be added to `.gitignore` and never committed to version control

## Next Steps / Enhancements

- [ ] Add recurring events support
- [ ] Customize reminder timing (currently fixed at 15 minutes)
- [ ] Multi-calendar support
- [ ] Sync existing Google Calendar events to notes
- [ ] Event editing from the notes UI
- [ ] More advanced date parsing (holidays, etc.)
