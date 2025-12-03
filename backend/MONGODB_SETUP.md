# MongoDB Setup Guide

## Installation

### Option 1: Local MongoDB (Recommended for Development)

#### On macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### On Ubuntu/Debian:
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### On Windows:
Download and install from: https://www.mongodb.com/try/download/community

### Option 2: MongoDB Atlas (Cloud - Free Tier Available)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update `MONGODB_URI` in `.env` file with your Atlas connection string

Example Atlas URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notepin?retryWrites=true&w=majority
```

## Migration

After installing MongoDB, migrate your existing notes:

```bash
cd backend
node migrate-to-mongodb.js
```

This will:
- Connect to MongoDB
- Read existing notes from `data/notes.json`
- Import them into MongoDB
- Create a backup of your JSON file

## Configuration

The MongoDB URI is configured in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/notepin
```

For local MongoDB, the default URI should work.
For MongoDB Atlas, replace with your connection string.

## Verify Connection

Start your backend server:

```bash
cd backend
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ Notes service initialized with MongoDB
```

## Database Structure

**Collection:** `notes`

**Schema:**
- `content` (String, required)
- `color` (String, default: '#ffffff')
- `link` (String, nullable)
- `calendarEventId` (String, nullable)
- `calendarEventUrl` (String, nullable)
- `isDuplicate` (Boolean, default: false)
- `createdAt` (Date)
- `updatedAt` (Date)

## Troubleshooting

### Connection Failed
- Make sure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongodb` (Linux)
- Check if port 27017 is available
- Verify MONGODB_URI in .env file

### Migration Issues
- Ensure MongoDB is running before migration
- Check that `data/notes.json` exists and is valid JSON
- Look for error messages in the migration output

## Benefits of MongoDB

✅ **Scalable**: Handles millions of notes easily
✅ **Fast**: Optimized for read/write operations
✅ **Reliable**: Built-in replication and backup
✅ **Flexible**: Easy to add new fields without migrations
✅ **Cloud-ready**: Easy to deploy with MongoDB Atlas
