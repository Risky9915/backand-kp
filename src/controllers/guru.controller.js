import { getAllGuru, getGuruById, addGuru, updateGuru, deleteGuru } from '../models/guru.model.js';
import bcrypt from 'bcryptjs';

export const getGuru = (req, res) => {
  getAllGuru((err, results) => {
    if (err) res.status(500).json({ error: err });
    else res.json(results);
  });
};

export const getGuruDetail = (req, res) => {
  const { id } = req.params;
  getGuruById(id, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else if (result.length === 0) res.status(404).json({ message: 'Guru tidak ditemukan' });
    else res.json(result[0]);
  });
};

export const createGuru = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const data = { ...req.body, password: hashed };
    addGuru(data, (err) => {
      if (err) res.status(500).json({ error: err });
      else res.json({ message: 'Guru berhasil ditambahkan' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editGuru = (req, res) => {
  const { id } = req.params;
  updateGuru(id, req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Guru berhasil diperbarui' });
  });
};

export const removeGuru = (req, res) => {
  const { id } = req.params;
  deleteGuru(id, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Guru berhasil dihapus' });
  });
};
