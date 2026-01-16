import { getAllJurusan, getJurusanById, addJurusan, updateJurusan, deleteJurusan } from '../models/jurusan.model.js';

export const getJurusan = (req, res) => {
  getAllJurusan((err, results) => {
    if (err) res.status(500).json({ error: err });
    else res.json(results);
  });
};

export const getJurusanDetail = (req, res) => {
  const { id } = req.params;
  getJurusanById(id, (err, result) => {
    if (err) res.status(500).json({ error: err });
    else if (result.length === 0) res.status(404).json({ message: 'Jurusan tidak ditemukan' });
    else res.json(result[0]);
  });
};

export const createJurusan = (req, res) => {
  addJurusan(req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Jurusan berhasil ditambahkan' });
  });
};

export const editJurusan = (req, res) => {
  const { id } = req.params;
  updateJurusan(id, req.body, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Jurusan berhasil diperbarui' });
  });
};

export const removeJurusan = (req, res) => {
  const { id } = req.params;
  deleteJurusan(id, (err) => {
    if (err) res.status(500).json({ error: err });
    else res.json({ message: 'Jurusan berhasil dihapus' });
  });
};
