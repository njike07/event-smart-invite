const express = require('express');
const router = express.Router();
const InviteController = require('../controllers/inviteControler');
const authMiddleware = require('../middlewares/authMiddleware');

// Toutes les routes protégées par JWT + rôle admin
router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

router.post('/', InviteController.addInvite);       // Ajouter
router.get('/', InviteController.getAllInvites);    // Liste
router.get('/:id', InviteController.getInviteById); // Détails
router.put('/:id', InviteController.updateInvite);  // Modifier
router.delete('/:id', InviteController.deleteInvite); // Supprimer
// Réponse RSVP par l'invité
router.put('/:id/rsvp', InviteController.updateRSVP);


module.exports = router;
