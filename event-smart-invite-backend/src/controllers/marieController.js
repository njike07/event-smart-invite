const Marie = require('../models/marieModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

const MarieController = {};

MarieController.register = async (req, res) => {
    try {
        const { nomMarie, nomMariee, email, telephone, motDePasse, dateMariage } = req.body;
        
        // Vérifier si l'email existe déjà
        const existingMarie = await Marie.findByEmail(email);
        if (existingMarie) {
            return res.status(400).json({ message: 'Un compte avec cet email existe déjà' });
        }
        
        // Validation des données
        if (!nomMarie || !nomMariee || !email || !telephone || !motDePasse || !dateMariage) {
            return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
        }
        
        const marie = await Marie.create(req.body);
        res.status(201).json({ 
            message: `Compte créé avec succès pour ${nomMarie} & ${nomMariee}`, 
            id: marie.insertId 
        });
    } catch (err) {
        console.error('Erreur création compte mariés:', err);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
};

MarieController.login = async (req, res) => {
    const { email, motDePasse } = req.body;
    try {
        const marie = await Marie.findByEmail(email);
        if (!marie) return res.status(401).json({ message: 'Email non trouvé' });

        const isMatch = await bcrypt.compare(motDePasse, marie.password);
        if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

        const token = jwt.sign({ id: marie.id, role: 'marie' }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ 
            token,
            user: {
                id: marie.id,
                nomMarie: marie.nom_marie,
                nomMariee: marie.nom_mariee,
                email: marie.email,
                telephone: marie.telephone,
                dateMariage: marie.date_mariage
            }
        });
    } catch (err) {
        console.error('Erreur connexion mariés:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

// Nouvelle méthode pour lister tous les comptes mariés (admin seulement)
MarieController.getAll = async (req, res) => {
    try {
        const maries = await Marie.getAll();
        res.json(maries);
    } catch (err) {
        console.error('Erreur récupération comptes mariés:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des comptes' });
    }
};

module.exports = MarieController;