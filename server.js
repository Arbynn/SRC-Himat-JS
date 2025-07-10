require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const produkRoutes = require('./routes/produkRoutes');
const authRoutes = require('./routes/authRoutes');
const pesananRoutes = require('./routes/pesananRoutes');

const app = express();
connectDB();

app.use(express.json()); // untuk parsing JSON
app.use(express.static(path.join(__dirname)));

app.use('/api/auth', authRoutes);
app.use('/api/pesanan', pesananRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use('/api/produks', produkRoutes);
app.get('/', (req, res) => {
  res.sendFile('API Produk berjalan!');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log('Route produk Routes aktif');


