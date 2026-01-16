import db from '../config/db.js';

export const getAllMateri = (cb) => {
  const q = `
    SELECT materi.*, jurusan.nama AS jurusan_nama, kelas.nama AS kelas_nama 
    FROM materi
    LEFT JOIN jurusan ON materi.jurusan_id = jurusan.id
    LEFT JOIN kelas ON materi.kelas_id = kelas.id
    ORDER BY materi.tanggalUpload DESC
  `;
  db.query(q, cb);
};

export const getMateriById = (id, cb) => {
  db.query('SELECT * FROM materi WHERE id = ?', [id], cb);
};

export const addMateri = (data, cb) => {
  const { judul, deskripsi, filePath, kelas_id, jurusan_id } = data;
  const q = `
    INSERT INTO materi (judul, deskripsi, linkMateri, kelas_id, jurusan_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(q, [judul, deskripsi, filePath, kelas_id, jurusan_id], cb);
};

export const updateMateri = (id, data, cb) => {
  const { judul, deskripsi, filePath, kelas_id, jurusan_id } = data;

  const q = `
    UPDATE materi
    SET judul = ?, deskripsi = ?, 
        linkMateri = COALESCE(?, linkMateri),
        kelas_id = ?, jurusan_id = ?
    WHERE id = ?
  `;

  db.query(q, [judul, deskripsi, filePath, kelas_id, jurusan_id, id], cb);
};

export const deleteMateri = (id, cb) => {
  db.query('DELETE FROM materi WHERE id = ?', [id], cb);
};
