require('dotenv').config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username });
if (!user) {
return res.status(404).json({ message: 'User tidak ditemukan' });
}
if (user.password !== password) {
return res.status(401).json({ message: 'Password salah'
});
}
const token = jwt.sign({ username }, process.env.JWT_SECRET,
{ expiresIn: '1h' });
res.json({ token });
};