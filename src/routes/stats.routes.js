import express from 'express';
import { fetchStats } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/', fetchStats);

export default router;
