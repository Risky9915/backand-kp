import ExcelJS from 'exceljs';
import db from '../config/db.js';

export const exportPengumpulanExcel = (req, res) => {
  const { tugasId, kelasId } = req.params;

  const query = `
    SELECT 
      s.id AS siswa_id,
      s.nama AS nama_siswa,
      pt.id AS pengumpulan_id,
      pt.file_path,
      pt.tanggal_pengumpulan,
      pt.nilai
    FROM siswa s
    LEFT JOIN pengumpulan_tugas pt 
      ON pt.siswa_id = s.id AND pt.tugas_id = ?
    WHERE s.kelas_id = ?
    ORDER BY s.nama ASC
  `;

  db.query(query, [tugasId, kelasId], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Pengumpulan Tugas');

    // =============================
    // 🟩 HEADER TITLE (MERGED)
    // =============================
    sheet.mergeCells('A1', 'E1');
    const title = sheet.getCell('A1');
    title.value = 'Laporan Pengumpulan Tugas';
    title.font = { size: 16, bold: true };
    title.alignment = { horizontal: 'center' };
    sheet.addRow([]);

    // =============================
    // 🟩 HEADER TABLE
    // =============================
    const headerRow = sheet.addRow(['Nama Siswa', 'Status', 'Tanggal Pengumpulan', 'Nilai', 'File']);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2F855A' }, // hijau gelap
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // =============================
    // 🟩 DATA ROWS
    // =============================
    result.forEach((row) => {
      const status = row.pengumpulan_id ? 'Sudah Mengumpulkan' : 'Belum';

      const date = row.tanggal_pengumpulan ? new Date(row.tanggal_pengumpulan).toLocaleString('id-ID') : '-';

      const nilai = row.nilai ?? '-';

      const fileURL = row.file_path ? `http://localhost:5000${row.file_path}` : '-';

      const newRow = sheet.addRow([row.nama_siswa, status, date, nilai, fileURL]);

      // tambahkan border ke tiap cell
      newRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });

      // jika ada file → jadikan hyperlink
      if (row.file_path) {
        const cell = newRow.getCell(5);
        cell.value = {
          text: 'Lihat File',
          hyperlink: fileURL,
        };
        cell.font = { color: { argb: 'FF1B4DD3' }, underline: true };
      }
    });

    // =============================
    // 🟩 SET COLUMN WIDTHS
    // =============================
    sheet.columns = [
      { width: 30 }, // Nama Siswa
      { width: 20 }, // Status
      { width: 25 }, // Tanggal Kumpul
      { width: 10 }, // Nilai
      { width: 40 }, // File
    ];

    // =============================
    // 🟩 SEND FILE
    // =============================
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=pengumpulan.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  });
};
