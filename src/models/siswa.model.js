import db from '../config/db.js';

export const getAllSiswa = (cb) => {
  const q = `
    SELECT siswa.*, kelas.nama AS kelas_nama, jurusan.nama AS jurusan_nama 
    FROM siswa 
    LEFT JOIN kelas ON siswa.kelas_id = kelas.id
    LEFT JOIN jurusan ON kelas.jurusan_id = jurusan.id
  `;
  db.query(q, cb);
};

export const getSiswaById = (id, cb) => {
  db.query('SELECT * FROM siswa WHERE id = ?', [id], cb);
};

export const addSiswa = (data, cb) => {
  db.query('INSERT INTO siswa SET ?', data, cb);
};

export const updateSiswa = (id, data, cb) => {
  db.query('UPDATE siswa SET ? WHERE id = ?', [data, id], cb);
};

export const deleteSiswa = (id, cb) => {
  db.query('DELETE FROM siswa WHERE id = ?', [id], cb);
};

export const getSiswaByNIS = (nis, cb) => {
  db.query('SELECT * FROM siswa WHERE nis = ?', [nis], cb);
};
