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

Happy note-taking! 📝✨
