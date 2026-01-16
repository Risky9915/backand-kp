import express from 'express';
import { getTugas, getTugasDetail, createTugas, editTugas, removeTugas, getTugasBySiswa, uploadTugasSiswa } from '../controllers/tugas.controller.js';
import { verifyToken } from '../middleware/auth.js';

import upload from '../middleware/uploadTugas.js';

const router = express.Router();

router.post('/', verifyToken, upload.fields([{ name: 'file_materi' }, { name: 'file_tugas' }]), createTugas);
router.post('/upload/:tugasId/:siswaId', upload.single('file'), uploadTugasSiswa);
router.get('/', verifyToken, getTugas);
router.get('/siswa/:id', verifyToken, getTugasBySiswa);
router.get('/:id', getTugasDetail);
router.put('/:id', editTugas);
router.delete('/:id', removeTugas);

export default router;
