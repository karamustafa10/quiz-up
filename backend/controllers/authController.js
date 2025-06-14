const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Kullanıcı kayıt işlemi
const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Var olan kullanıcı kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanımda.' });
        }

        // Şifreyi hash'le
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Yeni kullanıcı oluştur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role // student veya teacher olarak gelir
        });

        await newUser.save();

        res.status(201).json({ message: 'Kayıt başarılı!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// Kullanıcı giriş işlemi
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz e-posta veya şifre.' });
        }

        // JWT Token oluştur
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            message: 'Giriş başarılı!',
            token,
            user: payload
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// Kullanıcı profilini güncelleme
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, email, password } = req.body;
        const updateFields = { username, email };
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(password, salt);
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.json({ message: 'Profil güncellendi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Profil güncellenemedi.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateProfile
};
