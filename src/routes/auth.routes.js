import express from 'express';
import { changePassword, loginAdmin, loginGuru, loginSiswa } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/guru', loginGuru);
router.post('/siswa', loginSiswa);
router.post('/admin', loginAdmin);
router.put('/:role/change-password', verifyToken, changePassword);

export default router;
