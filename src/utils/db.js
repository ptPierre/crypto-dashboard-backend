const mongoose = require('mongoose');
const config = require('../config/config');

// Add the server API options as recommended by MongoDB Atlas
const clientOptions = { 
  serverApi: { 
    version: '1', 
    strict: true, 
    deprecationErrors: true 
  } 
};

const connectDB = async () => {
  try {
    // Pass the client options to the connect method
    await mongoose.connect(config.db.uri, clientOptions);
    
    // Verify connection with a ping
    await mongoose.connection.db.admin().command({ ping: 1 });
    
    // Get connection details for better feedback
    const dbDetails = {
      name: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      models: Object.keys(mongoose.models)
    };
    
    console.log("✅ MongoDB connection established successfully!");
    console.log(`📊 Connected to database: ${dbDetails.name}`);
    console.log(`🖥️  Database host: ${dbDetails.host}:${dbDetails.port}`);
    
    // List all available collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log('📁 No collections found in this database yet');
    } else {
      console.log('📁 Available collections:');
      collections.forEach(collection => {
        console.log(`   - ${collection.name}`);
      });
    }
    
    return true; // Return true to indicate successful connection
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 