import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = './uploads/tugas'; // default untuk tugas guru

    // 🔹 jika upload dari siswa (route pengumpulan)
    if (req.originalUrl.includes('/upload/')) {
      folder = './uploads/pengumpulan';
    }

    // 🔹 kalau upload materi guru
    if (file.fieldname === 'file_materi') folder = './uploads/materi';

    // pastikan folder ada
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error('Hanya file JPG, PNG, atau PDF yang diperbolehkan!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export default upload;
