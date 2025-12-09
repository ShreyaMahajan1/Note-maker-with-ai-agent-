# Full Stack Application

This is a simple full stack application with a React frontend and Node.js/Express backend.

## Project Structure

```
project/
  ├── backend/         # Express server
  │   ├── server.js
  │   └── package.json
  └── frontend/        # React application
      ├── public/
      ├── src/
      └── package.json
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The application will open in your browser at http://localhost:3000

## Features

- Express backend with AI-powered note management
- React frontend with modern UI
- MongoDB database integration
- Google Calendar integration
- AI features powered by Groq (Llama 3.3 70B)
  - Note suggestions and enhancements
  - Smart categorization
  - Meeting summaries
  - Daily inspirational quotes
- Hot-reloading development environment

## AI Configuration

This application uses a hybrid AI approach:
- **Groq (Llama 3.3 70B)** - For text-based AI features (quotes, suggestions, summaries)
- **Gemini** - For video/audio transcription (multimodal capabilities)

### Setup API Keys

1. Get your Groq API key from [Groq Console](https://console.groq.com/)
2. Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Add both to `backend/.env`:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```