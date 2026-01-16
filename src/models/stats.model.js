import db from '../config/db.js';

export const getStats = async () => {
  const [[guru]] = await db.promise().query('SELECT COUNT(*) AS total FROM guru');
  const [[siswa]] = await db.promise().query('SELECT COUNT(*) AS total FROM siswa');
  const [[kelas]] = await db.promise().query('SELECT COUNT(*) AS total FROM kelas');
  const [[jurusan]] = await db.promise().query('SELECT COUNT(*) AS total FROM jurusan');

  return {
    guru: guru.total,
    siswa: siswa.total,
    kelas: kelas.total,
    jurusan: jurusan.total,
  };
};
