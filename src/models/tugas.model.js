import db from '../config/db.js';

export const getAllTugas = (cb) => {
  const q = `
    SELECT tugas.*, jurusan.nama AS jurusan_nama, kelas.nama AS kelas_nama 
    FROM tugas
    LEFT JOIN jurusan ON tugas.jurusan_id = jurusan.id
    LEFT JOIN kelas ON tugas.kelas_id = kelas.id
    ORDER BY tugas.tanggalUpload DESC
  `;
  db.query(q, cb);
};

export const getTugasById = (id, cb) => {
  db.query('SELECT * FROM tugas WHERE id = ?', [id], cb);
};

// Ambil daftar tugas + materi + file upload siswa
export const getTugasBySiswaId = (siswaId, cb) => {
  const q = `
    SELECT 
      t.id,
      t.judul,
      t.deskripsi,
      t.deadline,
      m.linkMateri AS materi_link,
      tu.file_path AS file_tugas
    FROM tugas t
    LEFT JOIN materi m ON t.materi_id = m.id
    LEFT JOIN tugas_upload tu ON t.id = tu.tugas_id AND tu.siswa_id = ?
    ORDER BY t.deadline ASC
  `;
  db.query(q, [siswaId], cb);
};

export const addTugas = (data, cb) => {
  db.query('INSERT INTO tugas SET ?', data, cb);
};

export const updateTugas = (id, data, cb) => {
  // hanya izinkan field yang valid
  const allowedFields = ['judul', 'deskripsi', 'deadline', 'jurusan_id', 'kelas_id'];
  const filteredData = {};

  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      filteredData[key] = data[key];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    return cb(new Error('Tidak ada field yang bisa diperbarui'));
  }

  db.query('UPDATE tugas SET ? WHERE id = ?', [filteredData, id], cb);
};

export const deleteTugas = (id, cb) => {
  db.query('DELETE FROM tugas WHERE id = ?', [id], cb);
};
