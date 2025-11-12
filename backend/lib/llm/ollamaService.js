// Use global fetch when available (Node 18+). Fall back to node-fetch for older/node setups.
let fetchFn = globalThis.fetch;
if (!fetchFn) {
  try {
    // node-fetch v3 is ESM; require may return an object with default
    const nf = require('node-fetch');
    fetchFn = nf && nf.default ? nf.default : nf;
  } catch (e) {
    // leave fetchFn undefined; calls will fail with a helpful message
    fetchFn = undefined;
  }
}

class OllamaService {
    constructor() {
        this.model = 'mistral'; // Can be changed to any model you have pulled in Ollama
        this.baseUrl = process.env.OLLAMA_HOST || 'http://localhost:11434';
    }

    async generateResponse(prompt, type) {
        try {
            // System prompts for different types of operations
            const systemPrompts = {
                suggest: "You are a helpful note assistant. Suggest improvements or additions to the given note. Be concise and practical.",
                enhance: "You are a note enhancement expert. Expand and improve the given note with relevant details while maintaining its original meaning. Be concise.",
                categorize: "You are a note categorization expert. Analyze the note and suggest 2-3 relevant categories or tags. Be specific and concise."
            };

            if (!fetchFn) throw new Error('fetch is not available. Install node-fetch or run on Node 18+');

            const response = await fetchFn(`${this.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: prompt,
                    system: systemPrompts[type] || "You are a helpful AI assistant.",
                    options: {
                        temperature: 0.7,
                        top_p: 0.9
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();

            return data.response.trim();
        } catch (error) {
            console.error('Ollama generation error:', error.message);
            throw error;
        }
    }

    async getSuggestion(content) {
        return this.generateResponse(content, 'suggest');
    }

    async enhanceNote(content) {
        return this.generateResponse(content, 'enhance');
    }

    async categorizeNote(content) {
        return this.generateResponse(content, 'categorize');
    }

    // Method to list available models
    async listModels() {
        try {
            if (!fetchFn) throw new Error('fetch is not available. Install node-fetch or run on Node 18+');
            const response = await fetchFn(`${this.baseUrl}/api/tags`);
            if (!response.ok) {
                throw new Error(`Failed to fetch models: ${response.statusText}`);
            }
            const data = await response.json();
            return data.models || [];
        } catch (error) {
            console.error('Error listing models:', error.message);
            throw error;
        }
    }

    // Method to check if a specific model is available
    async checkModel(modelName = this.model) {
        try {
            const models = await this.listModels();
            return models.some(model => model.name === modelName || model.name.startsWith(modelName));
        } catch (error) {
            console.error('Error checking model:', error.message);
            return false;
        }
    }

    // Method to pull a model if not available
    async ensureModel(modelName = this.model) {
        try {
            const modelExists = await this.checkModel(modelName);
            if (!modelExists) {
                console.log(`⏳ Ollama model '${modelName}' not found locally. Please run: ollama pull ${modelName}`);
                return false;
            }
            console.log(`✅ Ollama model '${modelName}' is available`);
            return true;
        } catch (error) {
            console.error('⚠️ Warning: Could not verify model availability:', error.message);
            return false;
        }
    }
}

module.exports = new OllamaService();
