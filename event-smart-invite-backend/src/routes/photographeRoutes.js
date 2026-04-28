const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/login', async (req, res) => {
    const { telephone, password } = req.body;
    
    try {
        const [rows] = await db.query('SELECT * FROM photographes WHERE telephone = ?', [telephone]);
        
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Photographe non trouvé' });
        }
        
        const photographe = rows[0];
        const isValid = await bcrypt.compare(password, photographe.password);
        
        if (!isValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        
        const token = jwt.sign(
            { id: photographe.id, role: 'photographe' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '7d' }
        );
        
        res.json({ token, photographe: { id: photographe.id, nom: photographe.nom, telephone: photographe.telephone } });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

module.exports = router;
