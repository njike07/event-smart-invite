const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const AuthController = {};

// Login admin
AuthController.login = async (req, res) => {
    const { telephone, password } = req.body;
    if (!telephone || !password) {
        return res.status(400).json({ message: 'Téléphone et mot de passe requis' });
    }

    try {
        const admin = await Admin.findByTelephone(telephone);
        if (!admin) return res.status(401).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: admin.id, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });

        res.json({ token, admin: { id: admin.id, nom: admin.username, telephone: admin.telephone } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Créer un admin (optionnel)
AuthController.createAdmin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username et mot de passe requis' });

    try {
        const admin = await Admin.create(username, password);
        res.status(201).json({ message: 'Admin créé', adminId: admin.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = AuthController;
