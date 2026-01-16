import db from '../config/db.js';

export const getAllJurusan = (cb) => {
  db.query('SELECT * FROM jurusan', cb);
};

export const getJurusanById = (id, cb) => {
  db.query('SELECT * FROM jurusan WHERE id = ?', [id], cb);
};

export const addJurusan = (data, cb) => {
  db.query('INSERT INTO jurusan SET ?', data, cb);
};

export const updateJurusan = (id, data, cb) => {
  db.query('UPDATE jurusan SET ? WHERE id = ?', [data, id], cb);
};

export const deleteJurusan = (id, cb) => {
  db.query('DELETE FROM jurusan WHERE id = ?', [id], cb);
};
