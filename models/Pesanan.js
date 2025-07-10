// models/Pesanan.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  namaproduk: String,
  harga: Number,
  jumlah: Number,
});

const pesananSchema = new mongoose.Schema({
  nama: String,
  alamat: String,
  total: Number,
  tanggal: {
    type: Date,
    default: Date.now
  },
  items: [itemSchema]
});

module.exports = mongoose.model('Pesanan', pesananSchema);
