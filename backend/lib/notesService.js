const fs = require('fs').promises;
const path = require('path');

class NotesService {
    constructor() {
        this.filePath = path.join(__dirname, '../data/notes.json');
        this.notes = [];
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                await this.loadNotes();
                this.initialized = true;
            } catch (error) {
                console.error('Error initializing notes service:', error);
                // Create default data structure if file doesn't exist
                await this.saveNotes([]);
            }
        }
    }

    async loadNotes() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            const parsedData = JSON.parse(data);
            this.notes = parsedData.notes || [];
            return this.notes;
        } catch (error) {
            console.error('Error loading notes:', error);
            this.notes = [];
            throw error;
        }
    }

    async saveNotes(notes) {
        try {
            this.notes = notes;
            await fs.writeFile(
                this.filePath,
                JSON.stringify({ notes }, null, 2),
                'utf8'
            );
        } catch (error) {
            console.error('Error saving notes:', error);
            throw error;
        }
    }

    async getAllNotes() {
        await this.initialize();
        return this.notes;
    }

    async addNote(note) {
        await this.initialize();
        this.notes.unshift(note);
        await this.saveNotes(this.notes);
        return note;
    }

    async updateNote(id, updatedContent) {
        await this.initialize();
        const noteIndex = this.notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }

        this.notes[noteIndex] = {
            ...this.notes[noteIndex],
            ...updatedContent,
            updatedAt: new Date().toISOString()
        };

        await this.saveNotes(this.notes);
        return this.notes[noteIndex];
    }

    async deleteNote(id) {
        await this.initialize();
        const noteIndex = this.notes.findIndex(note => note.id === id);
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }

        this.notes = this.notes.filter(note => note.id !== id);
        await this.saveNotes(this.notes);
    }

    async getNoteById(id) {
        await this.initialize();
        return this.notes.find(note => note.id === id) || null;
    }
}

module.exports = new NotesService();
