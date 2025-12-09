const groqService = require('./llm/groqService');
const geminiService = require('./llm/geminiService');

console.log('🤖 Using AI Provider: GROQ (text) + GEMINI (video transcription)');

class AiUtils {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                await groqService.checkConfiguration();
                this.initialized = true;
            } catch (error) {
                console.error('⚠️ Failed to initialize Groq service:', error.message);
                this.initialized = false;
            }
        }
        return this.initialized;
    }

    async generateNoteSuggestion(content) {
        await this.initialize();
        const suggestion = await groqService.suggestNote(content);
        return { suggestion };
    }

    async enhanceNote(content) {
        await this.initialize();
        const enhanced = await groqService.enhanceNote(content);
        return { enhanced };
    }

    async categorizeNote(content) {
        await this.initialize();
        const category = await groqService.categorizeNote(content);
        return { category };
    }

    async generateQuote(mood) {
        await this.initialize();
        const quote = await groqService.generateQuote(mood);
        return { quote };
    }

    async summarizeMeeting(content) {
        await this.initialize();
        const summary = await groqService.generateMeetingSummary(content);
        return { summary };
    }

    async transcribeAndSummarize(filePath, mimeType) {
        // Video transcription uses Gemini (has multimodal support)
        const summary = await geminiService.transcribeAndSummarize(filePath, mimeType);
        return { summary };
    }
}

module.exports = new AiUtils();
