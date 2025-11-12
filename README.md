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

- Express backend with a test API endpoint
- React frontend that fetches and displays data from the backend
- Hot-reloading development environment