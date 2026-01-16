import { getStats } from '../models/stats.model.js';

export const fetchStats = async (req, res) => {
  try {
    const data = await getStats();
    res.json(data);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
};
