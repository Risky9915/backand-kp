import app from './app.js';
import dotenv from 'dotenv';
import './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
