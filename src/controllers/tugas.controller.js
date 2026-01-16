import { getTugasById, updateTugas } from '../models/tugas.model.js';
import db from '../config/db.js';
import fs from 'fs';
import path from 'path';

// ==================== GET SEMUA TUGAS ====================
export const getTugas = (req, res) => {
  const guruId = req.user?.id;

  const query = `
    SELECT *
    FROM tugas
    WHERE guru_id = ?
    ORDER BY tanggalUpload DESC
  `;

  db.query(query, [guruId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map((tugas) => ({
      ...tugas,
      deadline: Number(tugas.deadline),
    }));

    res.json(formatted);
  });
};

// ==================== GET DETAIL TUGAS ====================
export const getTugasDetail = (req, res) => {
  const { id } = req.params;
  getTugasById(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

    const tugas = result[0];
    (tugas.deadline = Number(tugas.deadline)), res.json(tugas);
  });
};

// ==================== GET TUGAS UNTUK SISWA ====================
export const getTugasBySiswa = (req, res) => {
  const { id } = req.params;

  const querySiswa = `
    SELECT kelas_id, kelas.jurusan_id
    FROM siswa
    JOIN kelas ON siswa.kelas_id = kelas.id
    WHERE siswa.id = ?
  `;

  db.query(querySiswa, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });

    const { kelas_id, jurusan_id } = result[0];

    // 🔹 Ambil semua tugas untuk kelas & jurusan siswa + nilai pengumpulan
    const queryTugas = `
      SELECT 
        t.id,
        t.judul,
        t.deskripsi,
        t.deadline,
        t.tanggalUpload,
        t.file_materi,
        t.file_tugas,
        pt.file_path AS file_pengumpulan,
        pt.nilai,
        CASE 
          WHEN pt.file_path IS NOT NULL THEN 'Sudah Upload'
          ELSE 'Belum Upload'
        END AS status
      FROM tugas t
      LEFT JOIN pengumpulan_tugas pt 
        ON pt.tugas_id = t.id AND pt.siswa_id = ?
      WHERE t.kelas_id = ? AND t.jurusan_id = ?
      ORDER BY t.tanggalUpload DESC
    `;

    db.query(queryTugas, [id, kelas_id, jurusan_id], (err, tugas) => {
      if (err) return res.status(500).json({ error: err.message });

      const formatted = tugas.map((t, i) => ({
        no: i + 1,
        ...t,
        deadline: Number(t.deadline),
        tanggalUpload: t.tanggalUpload,
      }));

      res.json(formatted);
    });
  });
};

// ==================== CREATE TUGAS (upload file_materi & file_tugas) ====================
export const createTugas = (req, res) => {
  try {
    const { judul, deskripsi, kelas_id, jurusan_id, deadline } = req.body;
    const guruId = req.user?.id; // ← ambil id guru dari token

    // 🔹 Validasi input wajib
    if (!judul || !deskripsi || !kelas_id || !jurusan_id || !deadline) {
      return res.status(400).json({
        message: 'Semua field wajib diisi kecuali file materi!',
      });
    }

    // 🔹 Cek file upload
    const fileMateri = req.files?.file_materi?.[0] ? `/uploads/materi/${req.files.file_materi[0].filename}` : null;

    const fileTugas = req.files?.file_tugas?.[0] ? `/uploads/tugas/${req.files.file_tugas[0].filename}` : null;

    if (!fileTugas) {
      return res.status(400).json({
        message: 'File tugas wajib diupload!',
      });
    }

    // 🔹 Simpan ke database (tambahkan guru_id & tanggal_upload)
    const query = `
      INSERT INTO tugas (
        judul, deskripsi, file_materi, file_tugas,
        kelas_id, jurusan_id, deadline, guru_id, tanggalUpload
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [judul, deskripsi, fileMateri, fileTugas, kelas_id, jurusan_id, deadline, guruId], (err) => {
      if (err) {
        console.error('❌ DB Error:', err);
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: '✅ Tugas berhasil ditambahkan!',
        fileMateri,
        fileTugas,
      });
    });
  } catch (error) {
    console.error('❌ Error di createTugas:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};

// ==================== UPDATE TUGAS ====================
export const editTugas = (req, res) => {
  const { id } = req.params;
  updateTugas(id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Tugas berhasil diperbarui' });
  });
};

// ==================== HAPUS TUGAS ====================
// export const removeTugas = (req, res) => {
//   const { id } = req.params;

//   // 🔹 1. Ambil path file sebelum dihapus
//   db.query('SELECT file_materi, file_tugas FROM tugas WHERE id = ?', [id], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (results.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

//     const { file_materi, file_tugas } = results[0];

//     // 🔹 2. Hapus file materi (jika ada)
//     if (file_materi) {
//       const materiPath = path.join(process.cwd(), file_materi);
//       if (fs.existsSync(materiPath)) {
//         fs.unlink(materiPath, (err) => {
//           if (err) console.error('Gagal menghapus file materi:', err);
//         });
//       }
//     }

//     // 🔹 3. Hapus file tugas (jika ada)
//     if (file_tugas) {
//       const tugasPath = path.join(process.cwd(), file_tugas);
//       if (fs.existsSync(tugasPath)) {
//         fs.unlink(tugasPath, (err) => {
//           if (err) console.error('Gagal menghapus file tugas:', err);
//         });
//       }
//     }

//     // 🔹 4. Hapus data tugas dari database
//     db.query('DELETE FROM tugas WHERE id = ?', [id], (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: '✅ Tugas dan file terkait berhasil dihapus.' });
//     });
//   });
// };

export const removeTugas = (req, res) => {
  const { id } = req.params;

  // 1. Ambil path file
  db.query('SELECT file_materi, file_tugas FROM tugas WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Tugas tidak ditemukan' });

    const { file_materi, file_tugas } = results[0];

    // Hapus file materi
    if (file_materi) {
      const materiPath = path.join(process.cwd(), file_materi);
      if (fs.existsSync(materiPath)) fs.unlink(materiPath, () => {});
    }

    // Hapus file tugas
    if (file_tugas) {
      const tugasPath = path.join(process.cwd(), file_tugas);
      if (fs.existsSync(tugasPath)) fs.unlink(tugasPath, () => {});
    }

    // 2. Hapus data tugas_siswa terkait
    db.query('DELETE FROM pengumpulan_tugas WHERE tugas_id = ?', [id], (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // 3. Baru hapus tugas utama
      db.query('DELETE FROM tugas WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          message: '✅ Tugas beserta pengumpulan siswa berhasil dihapus.',
        });
      });
    });
  });
};

// ==================== SISWA UPLOAD TUGAS ====================
export const uploadTugasSiswa = (req, res) => {
  const { tugasId, siswaId } = req.params;

  if (!req.file) return res.status(400).json({ message: 'File belum diupload!' });

  // 🔹 Ambil info kelas & jurusan siswa
  const querySiswa = `
    SELECT k.nama AS kelas_nama, j.nama AS jurusan_nama
    FROM siswa s
    JOIN kelas k ON s.kelas_id = k.id
    JOIN jurusan j ON k.jurusan_id = j.id
    WHERE s.id = ?
  `;

  db.query(querySiswa, [siswaId], (err, result) => {
    if (err) {
      console.error('❌ Error ambil data siswa:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Data siswa tidak ditemukan' });

    const { kelas_nama, jurusan_nama } = result[0];
    const folderPath = path.join('uploads', 'pengumpulan', jurusan_nama, kelas_nama);

    try {
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    } catch (fsErr) {
      console.error('❌ Gagal membuat folder:', fsErr);
      return res.status(500).json({ error: 'Gagal membuat folder penyimpanan' });
    }

    const oldPath = req.file.path;
    const newPath = path.join(folderPath, req.file.filename);

    try {
      fs.renameSync(oldPath, newPath);
    } catch (renameErr) {
      console.error('❌ Gagal memindahkan file:', renameErr);
      return res.status(500).json({ error: 'Gagal menyimpan file' });
    }

    const filePath = `/${newPath.replace(/\\/g, '/')}`;

    // 🔹 Cek apakah siswa sudah pernah upload tugas ini
    const checkQuery = `SELECT file_path FROM pengumpulan_tugas WHERE siswa_id = ? AND tugas_id = ?`;

    db.query(checkQuery, [siswaId, tugasId], (errCheck, existing) => {
      if (errCheck) {
        console.error('❌ Error cek tugas lama:', errCheck);
        return res.status(500).json({ error: errCheck.message });
      }

      if (existing.length > 0) {
        const oldFile = existing[0].file_path;
        console.log('🗑️ Menghapus file lama:', oldFile);

        try {
          if (oldFile) {
            const oldFilePath = path.join('.', oldFile.replace(/^\/+/, ''));
            if (fs.existsSync(oldFilePath)) {
              fs.unlinkSync(oldFilePath);
              console.log('🗑️ File lama dihapus:', oldFilePath);
            } else {
              console.warn('⚠️ File lama tidak ditemukan:', oldFilePath);
            }
          }
        } catch (unlinkErr) {
          console.error('❌ Gagal menghapus file lama:', unlinkErr);
          // tidak return di sini agar tetap lanjut update database
        }

        const updateQuery = `
          UPDATE pengumpulan_tugas
          SET file_path = ?, tanggal_pengumpulan = NOW()
          WHERE siswa_id = ? AND tugas_id = ?
        `;

        db.query(updateQuery, [filePath, siswaId, tugasId], (errUpdate) => {
          if (errUpdate) {
            console.error('❌ Gagal update database:', errUpdate);
            return res.status(500).json({ error: errUpdate.message });
          }
          console.log('✅ File tugas diperbarui:', filePath);
          res.json({ message: '✅ Tugas berhasil diperbarui!', filePath });
        });
      } else {
        const insertQuery = `
          INSERT INTO pengumpulan_tugas (siswa_id, tugas_id, file_path)
          VALUES (?, ?, ?)
        `;
        db.query(insertQuery, [siswaId, tugasId, filePath], (errInsert) => {
          if (errInsert) {
            console.error('❌ Gagal insert database:', errInsert);
            return res.status(500).json({ error: errInsert.message });
          }
          console.log('✅ Tugas pertama kali diupload:', filePath);
          res.json({ message: '✅ Tugas berhasil dikumpulkan!', filePath });
        });
      }
    });
  });
};
