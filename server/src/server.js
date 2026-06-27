import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 EduBoard API running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();

// Safety nets
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
