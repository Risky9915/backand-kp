import express from 'express';
import { getPengumpulanBySiswa, getPengumpulanByTugasDanKelas, updateNilai } from '../controllers/pengumpulan.controller.js';
import { verifyToken } from '../middleware/auth.js';
import { exportPengumpulanExcel } from '../controllers/exportPengumpulanExcel.controller.js';

const router = express.Router();

// 🔹 Ambil semua data pengumpulan (termasuk siswa yang belum mengumpulkan)
router.get('/tugas/:tugasId/kelas/:kelasId', verifyToken, getPengumpulanByTugasDanKelas);

// routes/pengumpulanRoutes.js
router.get('/export/tugas/:tugasId/kelas/:kelasId', exportPengumpulanExcel);

router.get('/siswa/:siswaId', verifyToken, getPengumpulanBySiswa);

// 🔹 Update nilai
router.put('/:id/nilai', verifyToken, updateNilai);

export default router;
