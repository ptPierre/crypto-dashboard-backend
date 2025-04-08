require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/crypto-watchlist'
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '1d'
  },
  api: {
    prefix: '/api'
  }
};

module.exports = config; 