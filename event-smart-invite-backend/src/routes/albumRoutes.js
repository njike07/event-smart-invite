const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/albumController');

router.post('/', AlbumController.createAlbum);
router.get('/', AlbumController.getAlbums);

module.exports = router;