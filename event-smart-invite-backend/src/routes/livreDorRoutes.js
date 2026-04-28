const express = require('express');
const router = express.Router();
const livreDorCtrl = require('../controllers/livreDorControler');

// Poster un message (invité / mariés)
router.post('/add', livreDorCtrl.addMessage);

// Voir messages publics
router.get('/public', livreDorCtrl.getVisibleMessages);

// Admin : voir tous les messages
router.get('/all', livreDorCtrl.getAllMessages);

// Admin : cacher / afficher un message
router.put('/:id', livreDorCtrl.updateStatus);

module.exports = router;
