const groqService = require('./llm/groqService');
const geminiService = require('./llm/geminiService');

// Choose AI provider based on environment variable
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq'; // 'groq' or 'gemini'
const aiService = AI_PROVIDER === 'groq' ? groqService : geminiService;

console.log(`🤖 Using AI Provider: ${AI_PROVIDER.toUpperCase()}`);

class AiUtils {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                // Ensure the model is available
                if (AI_PROVIDER === 'gemini') {
                    await geminiService.ensureModel();
                } else {
                    await groqService.checkConfiguration();
                }
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
        const suggestion = AI_PROVIDER === 'groq' 
            ? await groqService.suggestNote(content)
            : await geminiService.getSuggestion(content);
        return { suggestion };
    }

    async enhanceNote(content) {
        await this.initialize();
        const enhanced = AI_PROVIDER === 'groq'
            ? await groqService.enhanceNote(content)
            : await geminiService.enhanceNote(content);
        return { enhanced };
    }

    async categorizeNote(content) {
        await this.initialize();
        const category = AI_PROVIDER === 'groq'
            ? await groqService.categorizeNote(content)
            : await geminiService.categorizeNote(content);
        return { category };
    }

    async generateQuote(mood) {
        await this.initialize();
        const quote = AI_PROVIDER === 'groq'
            ? await groqService.generateQuote(mood)
            : await geminiService.generateQuote(mood);
        return { quote };
    }

    async summarizeMeeting(content) {
        await this.initialize();
        const summary = AI_PROVIDER === 'groq'
            ? await groqService.generateMeetingSummary(content)
            : await geminiService.summarizeMeeting(content);
        return { summary };
    }

    async transcribeAndSummarize(filePath, mimeType) {
        await this.initialize();
        // Video transcription only works with Gemini (has multimodal support)
        const summary = await geminiService.transcribeAndSummarize(filePath, mimeType);
        return { summary };
    }
}

module.exports = new AiUtils();
