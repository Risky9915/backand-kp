import db from '../config/db.js';

export const getPengumpulanByTugasDanKelas = (req, res) => {
  const { tugasId, kelasId } = req.params;

  const query = `
    SELECT 
      s.id AS siswa_id,
      s.nama AS nama_siswa,
      p.id AS pengumpulan_id,
      p.file_path,
      p.tanggal_pengumpulan,
      p.nilai
    FROM siswa s
    LEFT JOIN pengumpulan_tugas p 
      ON s.id = p.siswa_id AND p.tugas_id = ?
    WHERE s.kelas_id = ?
    ORDER BY s.nama ASC
  `;

  db.query(query, [tugasId, kelasId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil data pengumpulan' });
    }
    res.json(results);
  });
};

export const getPengumpulanBySiswa = (req, res) => {
  const { siswaId } = req.params;

  const query = `
    SELECT 
      t.id AS tugas_id,
      t.judul,
      t.deskripsi,
      t.deadline,
      p.id AS pengumpulan_id,
      p.file_path,
      p.tanggal_pengumpulan,
      p.nilai
    FROM tugas t
    LEFT JOIN pengumpulan_tugas p 
      ON t.id = p.tugas_id AND p.siswa_id = ?
    WHERE t.kelas_id = (SELECT kelas_id FROM siswa WHERE id = ?)
    ORDER BY t.tanggalUpload DESC
  `;

  db.query(query, [siswaId, siswaId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal mengambil data tugas siswa' });
    }
    res.json(results);
  });
};

export const updateNilai = (req, res) => {
  const { id } = req.params;
  const { nilai } = req.body;

  db.query('UPDATE pengumpulan_tugas SET nilai = ? WHERE id = ?', [nilai, id], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Gagal menyimpan nilai' });
    }
    res.json({ message: 'Nilai berhasil diperbarui' });
  });
};
