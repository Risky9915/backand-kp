import db from '../config/db.js';

export const getAllKelas = (cb) => {
  const q = `
    SELECT kelas.*, jurusan.nama AS jurusan_nama 
    FROM kelas 
    LEFT JOIN jurusan ON kelas.jurusan_id = jurusan.id
  `;
  db.query(q, cb);
};

export const getKelasById = (id, cb) => {
  db.query('SELECT * FROM kelas WHERE id = ?', [id], cb);
};

export const addKelas = (data, cb) => {
  db.query('INSERT INTO kelas SET ?', data, cb);
};

export const updateKelas = (id, data, cb) => {
  db.query('UPDATE kelas SET ? WHERE id = ?', [data, id], cb);
};

export const deleteKelas = (id, cb) => {
  db.query('DELETE FROM kelas WHERE id = ?', [id], cb);
};
