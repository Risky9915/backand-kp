import express from 'express';
import { getJurusan, getJurusanDetail, createJurusan, editJurusan, removeJurusan } from '../controllers/jurusan.controller.js';

const router = express.Router();

router.get('/', getJurusan);
router.get('/:id', getJurusanDetail);
router.post('/', createJurusan);
router.put('/:id', editJurusan);
router.delete('/:id', removeJurusan);

export default router;
