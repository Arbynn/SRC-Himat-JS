const Produk = require('../models/Produk');

// Validasi sederhana
const validateProduk = (data) => {
    const { namaproduk, deskripsi, harga, kategori } = data;
    if (!namaproduk || !deskripsi || !harga || !kategori) {
        return false;
    }
    return true;
};

// GET semua produk
exports.getAllProduks = async (req, res) => {
    const produks = await Produk.find();
    res.json(produks);
};

// POST tambah produk
exports.createProduk = async (req, res) => {
    if (!validateProduk(req.body)) {
        return res.status(400).json({ message: 'Semua field harus diisi, kecuali gambar.' });
    }

    const newProduk = new Produk(req.body);
    const saved = await newProduk.save();
    res.status(201).json(saved);
};

// PUT edit produk
exports.updateProduk = async (req, res) => {
    const { id } = req.params;
    if (!validateProduk(req.body)) {
        return res.status(400).json({ message: 'Semua field harus diisi, kecuali gambar.' });
}

    const updated = await Produk.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
};

// DELETE hapus produk
exports.deleteProduk = async (req, res) => {
    const { id } = req.params;
    await Produk.findByIdAndDelete(id);
    res.json({ message: 'Produk berhasil dihapus' });
};