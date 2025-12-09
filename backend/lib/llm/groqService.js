const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.client = null;
  }

  initialize() {
    if (!this.client) {
      if (!this.apiKey) {
        throw new Error('Groq API key not found in environment variables');
      }
      this.client = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Generic text generation helper
   */
  async generate(prompt, systemPrompt = 'You are a helpful assistant.') {
    this.initialize();

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // Fast and powerful
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      });

      let text = response.choices[0]?.message?.content?.trim() || '';
      
      // Clean up response: remove extra quotes and asterisks
      text = text.replace(/^["']|["']$/g, ''); // Remove quotes at start/end
      text = text.replace(/\*\*/g, ''); // Remove bold markdown
      text = text.replace(/\*/g, ''); // Remove asterisks
      text = text.replace(/^"|"$/g, ''); // Remove any remaining quotes
      
      return text;
    } catch (error) {
      console.error('Groq generation error:', error);
      throw new Error(`Groq generation error: ${error.message}`);
    }
  }

  /**
   * Generate a motivational quote
   */
  async generateQuote(mood = 'motivational') {
    // Add randomness to get different quotes each time
    const randomSeed = Math.floor(Math.random() * 1000000);
    const themes = {
      motivational: ['success', 'perseverance', 'achievement', 'determination', 'growth'],
      calm: ['peace', 'serenity', 'mindfulness', 'tranquility', 'balance'],
      happy: ['joy', 'gratitude', 'positivity', 'celebration', 'contentment'],
      focused: ['concentration', 'discipline', 'clarity', 'purpose', 'dedication'],
      creative: ['innovation', 'imagination', 'inspiration', 'originality', 'expression']
    };
    
    const moodThemes = themes[mood] || themes.motivational;
    const randomTheme = moodThemes[Math.floor(Math.random() * moodThemes.length)];
    
    const prompt = `Generate a unique ${mood} quote about ${randomTheme}. Return ONLY the quote text and author in this format:
Quote text here - Author Name

Do NOT use quotation marks or asterisks. Just plain text.
Make it inspiring and relevant to ${mood} themes. Random seed: ${randomSeed}`;

    const systemPrompt = 'You are a wise quote generator. Return only plain text without quotes, asterisks, or markdown formatting. Generate a different quote each time.';
    
    return await this.generate(prompt, systemPrompt);
  }

  /**
   * Suggest a note based on user input
   */
  async suggestNote(userPrompt) {
    const systemPrompt = 'You are a helpful note-taking assistant. Generate concise, actionable notes. Use plain text without quotes or asterisks.';
    return await this.generate(userPrompt, systemPrompt);
  }

  /**
   * Enhance an existing note
   */
  async enhanceNote(noteContent) {
    const prompt = `Improve this note by making it clearer, more organized, and actionable. Return plain text without quotes or asterisks:\n\n${noteContent}`;
    const systemPrompt = 'You are a note enhancement assistant. Make notes better while keeping them concise. Use plain text only.';
    return await this.generate(prompt, systemPrompt);
  }

  /**
   * Categorize a note
   */
  async categorizeNote(noteContent) {
    const prompt = `Categorize this note into ONE of these categories: Work, Personal, Todo, Idea, Shopping, Finance, or General.\n\nNote: ${noteContent}\n\nReturn ONLY the category name as plain text, nothing else.`;
    const systemPrompt = 'You are a categorization assistant. Return only the category name as plain text.';
    return await this.generate(prompt, systemPrompt);
  }

  /**
   * Generate meeting summary
   */
  async generateMeetingSummary(meetingNotes) {
    const prompt = `Summarize these meeting notes into key points, action items, and decisions. Use plain text without asterisks or special formatting:\n\n${meetingNotes}`;
    const systemPrompt = 'You are a meeting summary assistant. Create clear, structured summaries using plain text only.';
    return await this.generate(prompt, systemPrompt);
  }

  /**
   * Check if service is configured
   */
  async checkConfiguration() {
    if (!this.apiKey) {
      throw new Error('Groq API key not configured');
    }
    console.log('✅ Groq service configured with model: llama-3.3-70b-versatile');
    return true;
  }
}

module.exports = new GroqService();
