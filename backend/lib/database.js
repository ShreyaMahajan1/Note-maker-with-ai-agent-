const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connected = false;
  }

  async connect() {
    if (this.connected) {
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notepin';
      
      await mongoose.connect(mongoUri);

      this.connected = true;
      console.log('✅ MongoDB connected successfully');

      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        this.connected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
        this.connected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error.message);
      console.log('💡 Make sure MongoDB is installed and running:');
      console.log('   macOS: brew services start mongodb-community');
      console.log('   Linux: sudo systemctl start mongodb');
      console.log('   Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas');
      throw error;
    }
  }

  async disconnect() {
    if (this.connected) {
      await mongoose.disconnect();
      this.connected = false;
      console.log('MongoDB disconnected');
    }
  }
}

module.exports = new Database();
