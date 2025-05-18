import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import petRoutes from './routes/petRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import fosterRoutes from './routes/fosterRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Explicit list of allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://pet-adoption-platform-kp.netlify.app',
  'https://6828fc941d8a109bf2fc4a2c--pet-adoption-platform-kp.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (like Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy violation: Origin ${origin} not allowed`), false);
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());

// Static folder for uploads
app.use(express.static('public'));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/fosters', fosterRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Pet Adoption Platform API' });
});

// Error handler
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
