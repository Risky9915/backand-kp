import db from '../config/db.js';
import { addMateri, updateMateri as updateMateriModel } from '../models/materi.model.js';

// GET ALL
export const getMateri = (req, res) => {
  const query = `SELECT * FROM materi ORDER BY id DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// GET DETAIL
export const getMateriById = (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM materi WHERE id = ?`;
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Materi tidak ditemukan' });
    res.json(result[0]);
  });
};

export const createMateri = (req, res) => {
  const { judul, deskripsi, kelas_id, jurusan_id } = req.body;
  const filePath = req.file ? `/uploads/materi/${req.file.filename}` : null;

  addMateri({ judul, deskripsi, filePath, kelas_id, jurusan_id }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Materi berhasil ditambahkan', file: filePath });
  });
};

export const updateMateri = (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi, kelas_id, jurusan_id } = req.body;
  const filePath = req.file ? `/uploads/materi/${req.file.filename}` : null;

  updateMateriModel(id, { judul, deskripsi, filePath, kelas_id, jurusan_id }, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Materi berhasil diperbarui', file: filePath });
  });
};

// DELETE
export const removeMateri = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM materi WHERE id = ?`;
  db.query(query, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Materi berhasil dihapus' });
  });
};

// GET MATERI BY SISWA
export const getMateriBySiswa = (req, res) => {
  const { id } = req.params;

  const querySiswa = `
    SELECT kelas_id, kelas.jurusan_id
    FROM siswa
    JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.id = ?
  `;

  db.query(querySiswa, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    const { kelas_id, jurusan_id } = result[0];

    const queryMateri = `
      SELECT materi.*, jurusan.nama AS jurusan_nama, kelas.nama AS kelas_nama
      FROM materi
      LEFT JOIN jurusan ON materi.jurusan_id = jurusan.id
      LEFT JOIN kelas ON materi.kelas_id = kelas.id
      WHERE materi.kelas_id = ? AND materi.jurusan_id = ?
      ORDER BY materi.id DESC
    `;

    db.query(queryMateri, [kelas_id, jurusan_id], (err, materi) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(materi);
    });
  });
};
