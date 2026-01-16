import express from 'express';
import { getSiswa, getSiswaDetail, createSiswa, editSiswa, removeSiswa } from '../controllers/siswa.controller.js';

const router = express.Router();

router.get('/', getSiswa);
router.get('/:id', getSiswaDetail);
router.post('/', createSiswa);
router.put('/:id', editSiswa);
router.delete('/:id', removeSiswa);

export default router;
