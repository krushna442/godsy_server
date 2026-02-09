const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

/**
 * 1. GLOBAL MIDDLEWARE
 */
// Helmet helps secure your app by setting various HTTP headers
app.use(helmet({ crossOriginResourcePolicy: false })); 
app.use(cors({
  origin: ["https://godsy.tech,http://localhost:8080/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));app.use(morgan('dev')); // Logger for development
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for Form-Data

/**
 * 2. STATIC FILES (Serving Blog & Audit Images)
 */
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * 3. API ROUTES
 * Grouped together for better readability
 */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

/**
 * 4. ROOT ROUTE
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'GODSY-MAIN API is running successfully',
    status: 'Healthy',
    timestamp: new Date()
  });
});

/**
 * 5. ERROR HANDLING MIDDLEWARE
 * Must be defined after all routes
 */
app.use(notFound);    // Catch 404 errors
app.use(errorHandler); // Catch all other server errors

module.exports = app;