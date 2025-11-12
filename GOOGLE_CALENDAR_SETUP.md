# 🎉 Google Calendar Integration Setup Guide

## ✅ What's Been Built

Your notes app now has **automatic Google Calendar integration**! When you add a note with a date/time like:
- "Meeting tomorrow at 5pm"
- "Dentist appointment next Friday at 2:30pm"  
- "Call mom in 30 minutes"

The system automatically:
1. ✅ Parses the date from your note text
2. ✅ Creates a Google Calendar event
3. ✅ Sets a 15-minute reminder notification
4. ✅ Displays a "Scheduled" badge on your note with a link to the event

---

## 🚀 Getting Started (5 Minutes)

### Step 1: Get Google Calendar API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"** (or select existing one)
3. Search for **"Google Calendar API"** and click **"Enable"**
4. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
5. Select **"Desktop application"**
6. Download the JSON file
7. **Rename it to `credentials.json`** and place it here:
   ```
   /home/shreya/quadbtech/project/backend/credentials.json
   ```

### Step 2: Start the Application

**Terminal 1 - Backend:**
```bash
cd /home/shreya/quadbtech/project/backend
node server.js
```
Expected output:
```
🚀 Server is running on port 5000
ℹ️  No token.json found. OAuth2 flow required.
```

**Terminal 2 - Frontend:**
```bash
cd /home/shreya/quadbtech/project/frontend
npm start
```
This opens http://localhost:3000 automatically

### Step 3: Connect Your Google Calendar

1. Click the **"Connect Calendar"** button in the top-right corner
2. A Google authorization page opens
3. Click "Allow" to grant calendar access
4. You'll see: ✅ "Google Calendar connected successfully!"
5. The button now shows **"✓ Google Calendar Connected"** in green

### Step 4: Start Using It!

Type a note with a date/time and press "Add Note":

```
✍️  Type: "Team meeting tomorrow at 2pm"
📅 Press: "Add Note" button
✨ Result: 
   - Note is created
   - Calendar event created automatically
   - "Scheduled" badge appears on the note
   - Click the badge to view it in Google Calendar
```

---

## 📝 How to Use

### Writing Notes with Dates

The app recognizes many date formats:

| Example | Creates Event For |
|---------|-------------------|
| "tomorrow at 5pm" | Tomorrow at 17:00 |
| "next Monday at 3" | Next Monday at 15:00 |
| "in 30 minutes" | 30 minutes from now |
| "today at 2:30pm" | Today at 14:30 |
| "December 25 at 10am" | December 25 at 10:00 |
| "next Friday" | Next Friday at 12:00 (default) |
| "3 days from now" | 3 days from now at 12:00 |

### Note Features

Each note card shows:
- **Category badge** (Work, Personal, Todo, etc.)
- **Content** of your note
- **"Scheduled" badge** (if date was detected and event created)
  - Click it to open the event in Google Calendar
- **Date created** at the bottom

### Removing Notes

Click the **trash icon** on any note to delete it. The calendar event is NOT deleted - you need to delete it from Google Calendar separately if desired.

---

## 🔧 Technical Details

### Project Structure

```
/home/shreya/quadbtech/project/
├── backend/
│   ├── server.js                              ← Main server with calendar integration
│   ├── credentials.json                       ← Your Google API credentials (create this)
│   ├── token.json                             ← Auto-generated after authorization
│   ├── lib/
│   │   ├── googleCalendarService.js           ← Google Calendar API wrapper ✨ NEW
│   │   ├── notesService.js                    ← Notes storage
│   │   └── aiUtils.js                         ← AI features
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.js                             ← React main component (updated)
    │   ├── components/
    │   │   ├── VoiceControl.js               ← Voice input
    │   │   └── AiDialog.js                   ← AI dialog
    │   └── index.js
    └── package.json
```

### What Changed

**Backend (server.js):**
- ✅ Imports `chrono-node` for date parsing
- ✅ Creates `GoogleCalendarService` instance
- ✅ Updated `POST /api/notes` to detect dates and create calendar events
- ✅ Added `GET /auth/google` for OAuth start
- ✅ Added `GET /auth/google/callback` for OAuth completion
- ✅ Added `GET /api/google/status` to check authorization

**Frontend (App.js):**
- ✅ Added "Connect Calendar" button to toolbar
- ✅ Shows authorization status (green when connected)
- ✅ Added "Scheduled" badge on notes with calendar links
- ✅ Automatically sends user's timezone when adding notes

**New File (googleCalendarService.js):**
- ✅ Handles OAuth2 authentication flow
- ✅ Manages Google Calendar API interactions
- ✅ Creates events with 15-minute reminders
- ✅ Saves/loads OAuth tokens

---

## 🧪 Testing

### Test 1: Create a Note Without Date

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"content":"Just a regular note","color":"#ffffff"}'
```

Result: Regular note created, no calendar event

### Test 2: Create a Note With Date (Before Authorization)

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"content":"Meeting tomorrow at 5pm","color":"#ffffff","timezone":"Asia/Kolkata"}'
```

Result: Note created with date parsed, but NO calendar event (because not authorized yet)

### Test 3: Check Authorization Status

```bash
curl http://localhost:5000/api/google/status
```

Before connecting: `{"authorized":false}`
After connecting: `{"authorized":true}`

### Test 4: Create a Note With Date (After Authorization)

After clicking "Connect Calendar" and authorizing:

```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"content":"Team meeting tomorrow at 3pm","color":"#ffffff","timezone":"Asia/Kolkata"}'
```

Result:
```json
{
  "id": "1762858742712",
  "content": "Team meeting tomorrow at 3pm",
  "color": "#ffffff",
  "createdAt": "2025-11-11T10:59:02.712Z",
  "calendarEventId": "abc123xyz...",
  "calendarEventUrl": "https://calendar.google.com/calendar/u/0/r/eventedit/abc123xyz...",
  "updatedAt": "2025-11-11T10:59:05.000Z"
}
```

Check your Google Calendar - the event should be there! ✅

---

## 🔐 Security & Files

### credentials.json
- **Purpose**: OAuth2 client ID and secret from Google
- **Location**: `backend/credentials.json`
- **⚠️ WARNING**: Contains sensitive data - NEVER commit to version control
- **Add to .gitignore**: `echo "credentials.json" >> .gitignore`

### token.json
- **Purpose**: OAuth2 access token (auto-generated after authorization)
- **Location**: `backend/token.json`
- **⚠️ WARNING**: Contains your calendar access token - NEVER commit to version control
- **Add to .gitignore**: `echo "token.json" >> .gitignore`
- **Auto-generated**: Created automatically after you click "Connect Calendar"
- **Can be deleted**: If you delete it, just authorize again

---

## 🐛 Troubleshooting

### Problem: "Cannot GET /auth/google"
- **Cause**: Backend server not running
- **Fix**: Run `node server.js` in the backend directory

### Problem: "Google credentials not configured on server"
- **Cause**: `credentials.json` not found
- **Fix**: 
  1. Download credentials from Google Cloud Console
  2. Save as `backend/credentials.json`

### Problem: Date not being recognized
- **Examples that WILL work**:
  - "tomorrow"
  - "tomorrow at 5pm"
  - "next Friday"
  - "next Monday at 3:30pm"
  - "in 30 minutes"
  - "December 25 at 10am"
- **Examples that WON'T work**:
  - Just "5pm" (no date reference)
  - "sometime soon"
  - Random text

### Problem: Calendar event not appearing
- **Check**:
  1. Did you click "Connect Calendar" button?
  2. Is the "✓ Google Calendar Connected" button showing?
  3. Did you authorize the app when prompted?
  4. Check your Google Calendar for a new event

### Problem: "The Ocaml runtime is not built-in"
- **Ignore this message** - it's a warning, not an error
- Your app will still work fine

---

## 📱 UI Guide

### Top Bar (AppBar)
- **Left**: App title with icon
- **Right**: "Connect Calendar" button
  - Gray with text: Not connected - click to authorize
  - Green with checkmark: Connected and ready

### Note Cards
Each note shows:
- 📌 **Category badge**: Color-coded by note type
- 📅 **"Scheduled" badge**: Only appears if date was detected
  - Click it to open the event in Google Calendar
- 📝 **Note content**: Your text
- 🕐 **Created time**: When the note was added
- 🗑️ **Delete button**: Trash icon to remove the note

### Adding a Note
1. Type in the text box at the top
2. Optional: Choose a color using the palette icon
3. Click "Add Note" button
4. If it contains a date:
   - ✅ Note created
   - 📅 Calendar event created (if authorized)
   - 📛 "Scheduled" badge appears

---

## ⚙️ Advanced: How It Works

### Flow Diagram

```
User adds note
    ↓
Frontend sends: {content, color, timezone}
    ↓
Backend receives POST /api/notes
    ↓
Parse content with chrono-node
    ↓
Date found?
    ├─ NO  → Save note, return
    └─ YES →
        ↓
        Google Calendar authorized?
        ├─ NO  → Save note, return
        └─ YES →
            ↓
            Call Google Calendar API
            ↓
            Create event with:
            - Title: First line of note
            - Description: Full note content
            - Time: Parsed from note
            - Reminder: 15 minutes before
            ↓
            Save calendarEventUrl on note
            ↓
            Return note with event link
            ↓
            Frontend shows "Scheduled" badge
            ↓
            User can click badge to view event
```

### Code Walkthrough

**When note is added (server.js):**

```javascript
// Parse the content for dates
const results = chrono.parse(content);

if (results.length > 0 && googleCal.isAuthorized()) {
  // Extract the date
  const startDate = results[0].start.date();
  const endDate = // 1 hour after start
  
  // Create Google Calendar event
  const event = await googleCal.createEvent({
    summary: content.split('\n')[0],    // First line as title
    description: content,                // Full note as description
    startDate,
    endDate,
    timezone                            // User's timezone
  });
  
  // Save the event link to the note
  await notesService.updateNote(noteId, {
    calendarEventId: event.id,
    calendarEventUrl: event.htmlLink
  });
}
```

---

## 🎯 Next Steps

1. **✅ Done**: Basic calendar integration working
2. **Next** (Optional): 
   - Add custom reminder times
   - Support recurring events
   - Edit events from the app
   - More advanced date parsing

---

## 📞 Support

If something doesn't work:
1. Check that both backend and frontend are running
2. Check that `credentials.json` exists
3. Look for error messages in browser console (F12)
4. Check backend logs for server errors
5. Try deleting `token.json` and re-authorizing

---

## 🎉 Enjoy!

You now have a notes app that automatically creates Google Calendar events. Just type natural language dates in your notes and they'll be added to your calendar automatically!

**Example**:
```
📝 Type: "Lunch with John next Tuesday at 12:30pm"
➜ Note created
📅 Google Calendar event created automatically
✅ "Scheduled" badge appears
🔗 Click badge to view in Google Calendar
```

Happy note-taking! 📝✨
