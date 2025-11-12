const ollamaService = require('./llm/ollamaService');

class AiUtils {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            try {
                // Ensure the model is available
                await ollamaService.ensureModel();
                this.initialized = true;
            } catch (error) {
                console.error('⚠️ Failed to initialize AI service:', error.message);
                this.initialized = false;
            }
        }
        return this.initialized;
    }

    async generateNoteSuggestion(content) {
        try {
            await this.initialize();
            const suggestion = await ollamaService.getSuggestion(content);
            return { suggestion };
        } catch (error) {
            console.error('Error generating suggestion:', error.message);
            return { 
                suggestion: this.fallbackSuggestion(content)
            };
        }
    }

    async enhanceNote(content) {
        try {
            await this.initialize();
            const enhanced = await ollamaService.enhanceNote(content);
            return { enhanced };
        } catch (error) {
            console.error('Error enhancing note:', error.message);
            return { 
                enhanced: this.fallbackEnhancement(content)
            };
        }
    }

    async categorizeNote(content) {
        try {
            await this.initialize();
            const category = await ollamaService.categorizeNote(content);
            return { category };
        } catch (error) {
            console.error('Error categorizing note:', error.message);
            return { 
                category: this.fallbackCategories(content)
            };
        }
    }

    // Fallback methods in case LLM fails
    fallbackSuggestion(content) {
        const base = (content || 'Quick note').trim();
        const templates = [
            `${base}: Capture the main idea, 2-3 key points, and 1 action item.`,
            `${base} — Summary: A brief 1-2 sentence overview and next steps.`,
            `${base} — Notes:\n• Main point\n• Why it matters\n• Next action`,
        ];
        return templates[base.length % templates.length];
    }

    fallbackEnhancement(content) {
        const c = (content || '').trim();
        if (!c) return 'No content provided.';

        const sentences = c.split(/[.?!]\s+/).filter(Boolean);
        const top = sentences.slice(0, 2).map((s, i) => `${i + 1}. ${s.trim()}`);
        const details = sentences.length > 0 ? `Details:\n${top.join('\n')}` : '';
        const actions = '\nNext steps:\n- Define outcome\n- Assign owner\n- Set deadline';

        return `${c}\n\n${details}${actions}`;
    }

    fallbackCategories(content) {
        const text = (content || '').toLowerCase();
        const categories = {
            Work: ['meeting', 'project', 'deadline', 'client', 'deploy', 'release'],
            Personal: ['birthday', 'gym', 'dinner', 'family', 'home'],
            Todo: ['todo', 'task', 'do', 'finish', 'complete'],
            Idea: ['idea', 'brainstorm', 'prototype', 'concept'],
            Shopping: ['buy', 'purchase', 'order', 'shopping'],
            Finance: ['invoice', 'budget', 'pay', 'expense'],
        };

        for (const [cat, keys] of Object.entries(categories)) {
            for (const k of keys) {
                if (text.includes(k)) return cat;
            }
        }
        return 'General';
    }
}

module.exports = new AiUtils();
