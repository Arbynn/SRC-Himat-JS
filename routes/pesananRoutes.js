const express = require('express');
const router = express.Router();
const Pesanan = require('../models/Pesanan');

// Tambah pesanan (checkout)
router.post('/', async (req, res) => {
  try {
    const pesanan = new Pesanan(req.body);
    await pesanan.save();
    res.json({ message: 'Pesanan disimpan', data: pesanan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal simpan pesanan', error: err.message });
  }
});

// Ambil semua riwayat pesanan
router.get('/', async (req, res) => {
  try {
    const data = await Pesanan.find().sort({ tanggal: -1 });
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil data', error: err.message });
  }
});

module.exports = router;
