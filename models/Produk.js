const mongoose = require('mongoose');

const produkSchema = new mongoose.Schema({
    namaproduk: {
        type: String,
        required: true,
    },
    deskripsi: {
        type: String,
        required: true,
    },
    harga: {
        type: Number,
        required: true,
    },
    kategori:{
        type: String,
        require: true,
    },
    gambar: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model('Produk', produkSchema);