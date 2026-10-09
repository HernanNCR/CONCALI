import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.get('/prueba-pdf', (req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="prueba.pdf"');
  doc.pipe(res);
  doc.fontSize(25).text('PDF de prueba funcionando ✅', 100, 100);
  doc.end();
});

export default router;
