import express from 'express';
import { getGuru, getGuruDetail, createGuru, editGuru, removeGuru } from '../controllers/guru.controller.js';

const router = express.Router();

router.get('/', getGuru);
router.get('/:id', getGuruDetail);
router.post('/', createGuru);
router.put('/:id', editGuru);
router.delete('/:id', removeGuru);

export default router;
