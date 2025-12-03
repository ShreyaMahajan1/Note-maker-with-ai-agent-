const geminiService = require('./llm/geminiService');

class AiUtils {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                // Ensure the model is available
                await geminiService.ensureModel();
                this.initialized = true;
            } catch (error) {
                console.error('⚠️ Failed to initialize AI service:', error.message);
                this.initialized = false;
            }
        }
        return this.initialized;
    }

    async generateNoteSuggestion(content) {
        await this.initialize();
        const suggestion = await geminiService.getSuggestion(content);
        return { suggestion };
    }

    async enhanceNote(content) {
        await this.initialize();
        const enhanced = await geminiService.enhanceNote(content);
        return { enhanced };
    }

    async categorizeNote(content) {
        await this.initialize();
        const category = await geminiService.categorizeNote(content);
        return { category };
    }

    async generateQuote(mood) {
        await this.initialize();
        const quote = await geminiService.generateQuote(mood);
        return { quote };
    }

    async summarizeMeeting(content) {
        await this.initialize();
        const summary = await geminiService.summarizeMeeting(content);
        return { summary };
    }

    async transcribeAndSummarize(filePath, mimeType) {
        await this.initialize();
        const summary = await geminiService.transcribeAndSummarize(filePath, mimeType);
        return { summary };
    }
}

module.exports = new AiUtils();
