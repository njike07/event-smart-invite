const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const photoCtrl = require('../controllers/photographeControler');

// Photographe : upload
router.post('/upload', upload.single('image'), photoCtrl.uploadPhoto);

// Admin : liste des photos en attente
router.get('/pending', photoCtrl.listPendingPhotos);

// Admin : valider ou rejeter
router.put('/:photo_id', photoCtrl.updatePhotoStatus);

// Public : photos validées
router.get('/valid', photoCtrl.getValidPhotos);

module.exports = router;
