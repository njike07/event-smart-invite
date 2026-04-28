const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authControler');

// Login
router.post('/login', AuthController.login);

// Créer admin (optionnel)
router.post('/create-admin', AuthController.createAdmin);

module.exports = router;
