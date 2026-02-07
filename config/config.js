require('dotenv').config();

// Advanced: Check for required environment variables early
const requiredEnvs = [
  'MONGO_URI', 
  'JWT_SECRET', 
  'CLOUDINARY_CLOUD_NAME', 
  'CLOUDINARY_API_KEY', 
  'CLOUDINARY_API_SECRET'
];

requiredEnvs.forEach((name) => {
  if (!process.env[name]) {
    console.error(`❌ Error: Environment variable ${name} is missing!`);
    process.exit(1);
  }
});

module.exports = {
  // Database Configuration
  mongoURI: process.env.MONGO_URI,
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: '30d',

  // Cloudinary Configuration (For Blog Images)
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  // Environment Settings
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
};