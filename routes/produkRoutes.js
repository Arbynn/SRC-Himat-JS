const auth = require('../middlewares/auth');
const express = require('express');
const router = express.Router();
const controller = require('../controllers/produkController');

router.get('/', controller.getAllProduks);
router.get('/:id', async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    if (!produk) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json(produk); // 👈 Langsung kirim objek produk, jangan bungkus
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil produk' });
  }
});
router.post('/', auth,  controller.createProduk);
router.put('/:id', auth,  controller.updateProduk);
router.delete('/:id', auth,  controller.deleteProduk);

module.exports = router;