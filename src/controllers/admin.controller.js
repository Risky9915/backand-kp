import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createAdmin = async (req, res) => {
  try {
    const { nama, email, nip, password } = req.body;

    // Validasi
    if (!nama || !email || !nip || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek email atau nip sudah ada
    db.query(`SELECT * FROM admin WHERE email = ? OR nip = ?`, [email, nip], async (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email atau NIP telah digunakan' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert admin baru
      const query = `
          INSERT INTO admin (nama, email, nip, password)
          VALUES (?, ?, ?, ?)
        `;

      db.query(query, [nama, email, nip, hashedPassword], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.json({ message: 'Admin berhasil ditambahkan' });
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
