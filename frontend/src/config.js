// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Log for debugging
console.log('🔧 API_BASE_URL:', API_BASE_URL);
console.log('🔧 REACT_APP_API_URL env:', process.env.REACT_APP_API_URL);

export default API_BASE_URL;
