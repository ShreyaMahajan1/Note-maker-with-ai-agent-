const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const database = require('./lib/database');
const Note = require('./models/Note');

async function migrateNotes() {
  try {
    console.log('🔄 Starting migration from JSON to MongoDB...');
    
    // Connect to MongoDB
    await database.connect();
    
    // Read existing notes from JSON file
    const jsonPath = path.join(__dirname, 'data/notes.json');
    let existingNotes = [];
    
    try {
      const data = await fs.readFile(jsonPath, 'utf8');
      const parsed = JSON.parse(data);
      existingNotes = parsed.notes || [];
      console.log(`📄 Found ${existingNotes.length} notes in JSON file`);
    } catch (error) {
      console.log('📄 No existing notes.json file found or empty');
    }
    
    if (existingNotes.length === 0) {
      console.log('✅ No notes to migrate');
      await database.disconnect();
      return;
    }
    
    // Check if notes already exist in MongoDB
    const existingCount = await Note.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠️  MongoDB already has ${existingCount} notes`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Do you want to clear existing notes and migrate? (yes/no): ', resolve);
      });
      readline.close();
      
      if (answer.toLowerCase() !== 'yes') {
        console.log('❌ Migration cancelled');
        await database.disconnect();
        return;
      }
      
      await Note.deleteMany({});
      console.log('🗑️  Cleared existing notes from MongoDB');
    }
    
    // Migrate notes
    let migrated = 0;
    for (const note of existingNotes) {
      try {
        await Note.create({
          content: note.content,
          color: note.color || '#ffffff',
          link: note.link || null,
          calendarEventId: note.calendarEventId || null,
          calendarEventUrl: note.calendarEventUrl || null,
          isDuplicate: note.isDuplicate || false,
          createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
        });
        migrated++;
      } catch (error) {
        console.error(`❌ Failed to migrate note: ${note.id}`, error.message);
      }
    }
    
    console.log(`✅ Successfully migrated ${migrated} out of ${existingNotes.length} notes`);
    
    // Create backup of JSON file
    const backupPath = path.join(__dirname, 'data/notes.json.backup');
    await fs.copyFile(jsonPath, backupPath);
    console.log(`💾 Created backup at ${backupPath}`);
    
    await database.disconnect();
    console.log('✅ Migration complete!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateNotes();
