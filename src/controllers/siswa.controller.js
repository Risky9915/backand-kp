import { getAllSiswa, getSiswaById, addSiswa, updateSiswa, deleteSiswa } from '../models/siswa.model.js';
import bcrypt from 'bcryptjs';

export const getSiswa = (req, res) => {
  getAllSiswa((err, results) => {
    if (err) res.status(500).json({ error: err });
    else res.json(results);
  });
};

export const getSiswaDetail = (req, res) => {
  const { id } = req.params;
  getSiswaById(id, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else if (result.length === 0) res.status(404).json({ message: 'Siswa tidak ditemukan' });
    else res.json(result[0]);
  });
};

export const createSiswa = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const data = { ...req.body, password: hashed };
    addSiswa(data, (err) => {
      if (err) res.status(500).json({ error: err });
      else res.json({ message: 'Siswa berhasil ditambahkan' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editSiswa = (req, res) => {
  const { id } = req.params;
  updateSiswa(id, req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Siswa berhasil diperbarui' });
  });
};

export const removeSiswa = (req, res) => {
  const { id } = req.params;
  deleteSiswa(id, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Siswa berhasil dihapus' });
  });
};
