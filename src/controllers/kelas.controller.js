import { getAllKelas, getKelasById, addKelas, updateKelas, deleteKelas } from '../models/kelas.model.js';

export const getKelas = (req, res) => {
  getAllKelas((err, results) => {
    if (err) res.status(500).json({ error: err });
    else res.json(results);
  });
};

export const getKelasDetail = (req, res) => {
  const { id } = req.params;
  getKelasById(id, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else if (result.length === 0) res.status(404).json({ message: 'Kelas tidak ditemukan' });
    else res.json(result[0]);
  });
};

export const createKelas = (req, res) => {
  addKelas(req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Kelas berhasil ditambahkan' });
  });
};

export const editKelas = (req, res) => {
  const { id } = req.params;
  updateKelas(id, req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Kelas berhasil diperbarui' });
  });
};

export const removeKelas = (req, res) => {
  const { id } = req.params;
  deleteKelas(id, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Kelas berhasil dihapus' });
  });
};
