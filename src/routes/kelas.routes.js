import express from 'express';
import { getKelas, getKelasDetail, createKelas, editKelas, removeKelas } from '../controllers/kelas.controller.js';

const router = express.Router();

router.get('/', getKelas);
router.get('/:id', getKelasDetail);
router.post('/', createKelas);
router.put('/:id', editKelas);
router.delete('/:id', removeKelas);

export default router;
