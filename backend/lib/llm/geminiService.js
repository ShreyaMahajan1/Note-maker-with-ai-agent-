const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.client = null;
  }

  initialize() {
    if (!this.client) {
      if (!this.apiKey) {
        throw new Error('Gemini API key not found in environment variables');
      }
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  /**
   * Generic text generation helper
   */
  async generate(prompt, systemPrompt = 'You are a helpful assistant.') {
    this.initialize();

    const fullPrompt = `${systemPrompt}\n\n${prompt}`;

    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash', // ya 'gemini-1.5-flash' / 'gemini-2.0-flash'
        contents: [
          {
            role: 'user',
            parts: [{ text: fullPrompt }],
          },
        ],
      });


      // ✅ Route jaisa manual extraction:
      const text =
        response.candidates?.[0]?.content?.parts
          ?.map((p) => (p && typeof p.text === 'string' ? p.text : ''))
          .join('') ?? '';

      return text.trim();
    } catch (error) {
      console.error('Gemini generation error:', error);
      const msg = error?.message || String(error);
      throw new Error(`Gemini generation error: ${msg}`);
    }
  }

  async getSuggestion(content) {
    const prompt = `Given this note content: "${content}"
        
Provide a helpful suggestion to improve or expand this note. Keep it concise and actionable.`;

    const systemPrompt =
      'You are a note-taking assistant that helps users improve their notes with practical suggestions. Do not use asterisks, markdown formatting, or special characters. Write in plain text only.';

    return await this.generate(prompt, systemPrompt);
  }

  async enhanceNote(content) {
    const prompt = `Enhance and improve this note while keeping its core meaning:

"${content}"

Make it more structured, clear, and actionable. Add relevant details if helpful.`;

    const systemPrompt =
      'You are a note enhancement assistant. Improve notes by making them clearer, more structured, and actionable. Do not use asterisks, markdown formatting, or special characters. Write in plain text only. Use simple bullet points with hyphens if needed.';

    return await this.generate(prompt, systemPrompt);
  }

  async categorizeNote(content) {
    const prompt = `Categorize this note into ONE of these categories: Work, Personal, Todo, Idea, Shopping, Finance, or General.

Note: "${content}"

Respond with ONLY the category name, nothing else.`;

    const systemPrompt =
      'You are a note categorization assistant. Respond with only the category name.';

    return await this.generate(prompt, systemPrompt);
  }

  async generateQuote(mood = 'motivational') {
    const prompt = `Generate a ${mood} quote that is inspiring and meaningful. The quote should be original and thought-provoking.`;

    const systemPrompt =
      'You are a wise quote generator. Create original, inspiring quotes. Do not use asterisks, markdown formatting, or special characters. Return only the quote text without quotation marks or attribution.';

    return await this.generate(prompt, systemPrompt);
  }

  async summarizeMeeting(content) {
    const prompt = `Analyze these meeting notes or transcript and provide a structured summary:

"${content}"

Format the response as:

SUMMARY:
[Brief 2-3 sentence overview of the meeting]

KEY POINTS:
- [Main point 1]
- [Main point 2]
- [Main point 3]

ACTION ITEMS:
- [Action item 1 with owner if mentioned]
- [Action item 2 with owner if mentioned]

DECISIONS MADE:
- [Decision 1]
- [Decision 2]

NEXT STEPS:
- [Next step 1]
- [Next step 2]`;

    const systemPrompt =
      'You are a meeting notes assistant. Extract key information from meeting notes and format them clearly. Use simple hyphens for bullet points. Do not use asterisks or markdown formatting. Write in plain text only.';

    return await this.generate(prompt, systemPrompt);
  }

  async transcribeAndSummarize(filePath, mimeType) {
    this.initialize();

    try {
      // Read file as base64
      const fileBuffer = fs.readFileSync(filePath);
      const base64Data = fileBuffer.toString('base64');

      console.log(`📹 Processing ${mimeType} file: ${path.basename(filePath)}`);

      // Use Gemini to transcribe and summarize
      const response = await this.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
              {
                text: `Transcribe this audio/video and provide a structured meeting summary.

IMPORTANT: Do not use asterisks, markdown formatting, or special characters. Write in plain text only. Use simple hyphens for bullet points.

Format the response as:

TRANSCRIPT:
[Full transcription of the audio/video]

SUMMARY:
[Brief 2-3 sentence overview]

KEY POINTS:
- [Main point 1]
- [Main point 2]
- [Main point 3]

ACTION ITEMS:
- [Action item 1]
- [Action item 2]

DECISIONS MADE:
- [Decision 1]
- [Decision 2]

NEXT STEPS:
- [Next step 1]
- [Next step 2]`,
              },
            ],
          },
        ],
      });

      const text =
        response.candidates?.[0]?.content?.parts
          ?.map((p) => (p && typeof p.text === 'string' ? p.text : ''))
          .join('') ?? '';

      // Clean up the uploaded file
      try {
        fs.unlinkSync(filePath);
        console.log('✅ Cleaned up uploaded file');
      } catch (cleanupErr) {
        console.warn('⚠️ Failed to cleanup file:', cleanupErr.message);
      }

      return text.trim();
    } catch (error) {
      console.error('Gemini transcription error:', error);
      
      // Clean up file on error too
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (cleanupErr) {
        console.warn('⚠️ Failed to cleanup file on error:', cleanupErr.message);
      }

      const msg = error?.message || String(error);
      throw new Error(`Transcription failed: ${msg}`);
    }
  }

  async ensureModel() {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }
    console.log('✅ Gemini service configured with model: gemini-2.5-flash');
    return true;
  }
}

module.exports = new GeminiService();
