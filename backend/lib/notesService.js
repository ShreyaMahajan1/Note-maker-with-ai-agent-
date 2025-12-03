const Note = require('../models/Note');
const database = require('./database');

class NotesService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                await database.connect();
                this.initialized = true;
                console.log('✅ Notes service initialized with MongoDB');
            } catch (error) {
                console.error('❌ Error initializing notes service:', error);
                throw error;
            }
        }
    }

    async getAllNotes() {
        await this.initialize();
        try {
            const notes = await Note.find().sort({ createdAt: -1 });
            // Convert MongoDB _id to id for frontend compatibility
            return notes.map(note => ({
                id: note._id.toString(),
                content: note.content,
                color: note.color,
                link: note.link,
                calendarEventId: note.calendarEventId,
                calendarEventUrl: note.calendarEventUrl,
                isDuplicate: note.isDuplicate,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            }));
        } catch (error) {
            console.error('Error fetching notes:', error);
            throw error;
        }
    }

    async addNote(noteData) {
        await this.initialize();
        try {
            const note = new Note({
                content: noteData.content,
                color: noteData.color || '#ffffff',
                link: noteData.link || null,
                calendarEventId: noteData.calendarEventId || null,
                calendarEventUrl: noteData.calendarEventUrl || null,
                isDuplicate: noteData.isDuplicate || false,
            });
            
            await note.save();
            
            return {
                id: note._id.toString(),
                content: note.content,
                color: note.color,
                link: note.link,
                calendarEventId: note.calendarEventId,
                calendarEventUrl: note.calendarEventUrl,
                isDuplicate: note.isDuplicate,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            };
        } catch (error) {
            console.error('Error adding note:', error);
            throw error;
        }
    }

    async updateNote(id, updatedContent) {
        await this.initialize();
        try {
            const note = await Note.findById(id);
            if (!note) {
                throw new Error('Note not found');
            }

            Object.assign(note, updatedContent);
            note.updatedAt = new Date();
            await note.save();

            return {
                id: note._id.toString(),
                content: note.content,
                color: note.color,
                link: note.link,
                calendarEventId: note.calendarEventId,
                calendarEventUrl: note.calendarEventUrl,
                isDuplicate: note.isDuplicate,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            };
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    async deleteNote(id) {
        await this.initialize();
        try {
            const result = await Note.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Note not found');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }

    async getNoteById(id) {
        await this.initialize();
        try {
            const note = await Note.findById(id);
            if (!note) {
                return null;
            }

            return {
                id: note._id.toString(),
                content: note.content,
                color: note.color,
                link: note.link,
                calendarEventId: note.calendarEventId,
                calendarEventUrl: note.calendarEventUrl,
                isDuplicate: note.isDuplicate,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
            };
        } catch (error) {
            console.error('Error fetching note by ID:', error);
            return null;
        }
    }
}

module.exports = new NotesService();
