import db from '../config/db.js';

// Ambil semua guru
export const getAllGuru = (cb) => {
  db.query('SELECT id, nama, nip FROM guru', cb);
};

// Ambil guru berdasarkan ID
export const getGuruById = (id, cb) => {
  db.query('SELECT id, nama, nip FROM guru WHERE id = ?', [id], cb);
};

// Tambah guru baru
export const addGuru = (data, cb) => {
  const query = `
    INSERT INTO guru (nama, nip, password)
    VALUES (?, ?, ?)
  `;
  db.query(query, [data.nama, data.nip, data.password], cb);
};

// Update guru
export const updateGuru = (id, data, cb) => {
  const fields = [];
  const params = [];

  if (data.nama) {
    fields.push('nama = ?');
    params.push(data.nama);
  }

  if (data.nip) {
    fields.push('nip = ?');
    params.push(data.nip);
  }

  if (data.password) {
    fields.push('password = ?');
    params.push(data.password);
  }

  const query = `
    UPDATE guru SET ${fields.join(', ')}
    WHERE id = ?
  `;

  params.push(id);

  db.query(query, params, cb);
};

// Hapus guru
export const deleteGuru = (id, cb) => {
  db.query('DELETE FROM guru WHERE id = ?', [id], cb);
};

// Ambil guru berdasarkan NIP (untuk login)
export const getGuruByNip = (nip, cb) => {
  db.query('SELECT * FROM guru WHERE nip = ?', [nip], cb);
};
