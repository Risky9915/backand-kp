import express from 'express';
import cors from 'cors';
import jurusanRoutes from './routes/jurusan.routes.js';
import kelasRoutes from './routes/kelas.routes.js';
import guruRoutes from './routes/guru.routes.js';
import siswaRoutes from './routes/siswa.routes.js';
import materiRoutes from './routes/materi.routes.js';
import tugasRoutes from './routes/tugas.routes.js';
import authRoutes from './routes/auth.routes.js';
import pengumpulanRoutes from './routes/pengumpulan.routes.js';
import adminRoutes from './routes/admin.routes.js';
import statsRoutes from './routes/stats.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API berjalan');
});

app.use('/uploads', express.static('uploads'));

// Daftar routes utama
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jurusan', jurusanRoutes);
app.use('/api/kelas', kelasRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/siswa', siswaRoutes);
app.use('/api/materi', materiRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/pengumpulan', pengumpulanRoutes);
app.use('/api/stats', statsRoutes);

import db from './config/db.js';

app.get('/api/health/db', async (req, res) => {
  try {
    const [rows] = await db.query('SHOW TABLES');
    res.json({
      status: 'ok',
      tables: rows
    });
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

export default app;