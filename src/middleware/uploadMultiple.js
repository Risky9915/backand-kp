// middleware/uploadMultiple.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Buat folder kalau belum ada
const dirs = ['./uploads/materi', './uploads/tugas'];
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'materi') cb(null, './uploads/materi');
    else cb(null, './uploads/tugas');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
export default upload;
