import express from 'express';
import { getMateri, getMateriById, createMateri, updateMateri, removeMateri, getMateriBySiswa } from '../controllers/materi.controller.js';
import { verifyToken } from '../middleware/auth.js';
import upload from '../middleware/uploadMateri.js'; // ✅ penting

const router = express.Router();

// Urutan yang benar
router.get('/siswa/:id', verifyToken, getMateriBySiswa);
router.get('/', verifyToken, getMateri);
router.get('/:id', verifyToken, getMateriById);
router.post('/', verifyToken, upload.single('file'), createMateri);
router.put('/:id', verifyToken, upload.single('file'), updateMateri);
router.delete('/:id', verifyToken, removeMateri);

export default router;
