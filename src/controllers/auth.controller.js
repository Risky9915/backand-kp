import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

export const loginGuru = (req, res) => {
  const { nip, password } = req.body;

  db.query('SELECT * FROM guru WHERE nip = ?', [nip], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Guru tidak ditemukan' });

    const guru = results[0];

    const validPass = await bcrypt.compare(password, guru.password);
    if (!validPass) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: guru.id, role: 'guru', nama: guru.nama, nip: guru.nip }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login berhasil',
      token,
      role: 'guru',
      id: guru.id,
      nama: guru.nama,
      nip: guru.nip,
    });
  });
};

export const loginSiswa = (req, res) => {
  const { nis, password } = req.body;

  db.query('SELECT * FROM siswa WHERE nis = ?', [nis], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    const siswa = results[0];
    const validPass = await bcrypt.compare(password, siswa.password);
    if (!validPass) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: siswa.id, role: 'siswa', nama: siswa.nama, nis: siswa.nis }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login berhasil', token, id: siswa.id, role: 'siswa', nama: siswa.nama });
  });
};

export const loginAdmin = (req, res) => {
  const { identifier, password } = req.body; // identifier = email atau nip

  db.query(`SELECT * FROM admin WHERE email = ? OR nip = ?`, [identifier, identifier], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Admin tidak ditemukan' });

    const admin = results[0];
    const validPass = await bcrypt.compare(password, admin.password);

    if (!validPass) return res.status(401).json({ message: 'Password salah' });

    const token = jwt.sign({ id: admin.id, role: 'admin', nama: admin.nama }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login berhasil',
      token,
      role: 'admin',
      id: admin.id,
      nama: admin.nama,
    });
  });
};

export const changePassword = async (req, res) => {
  const { role } = req.params;
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  const table = role === 'guru' ? 'guru' : role === 'admin' ? 'admin' : 'siswa';

  db.query(`SELECT password FROM ${table} WHERE id = ?`, [userId], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (results.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    const match = await bcrypt.compare(oldPassword, results[0].password);
    if (!match) return res.status(400).json({ message: 'Password lama salah' });

    const hashed = await bcrypt.hash(newPassword, 10);
    db.query(`UPDATE ${table} SET password = ? WHERE id = ?`, [hashed, userId], (err2) => {
      if (err2) return res.status(500).json({ message: 'Gagal mengubah password' });
      res.json({ message: 'Password berhasil diubah' });
    });
  });
};
