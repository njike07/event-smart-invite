const express = require('express');
const router = express.Router();
const MarieController = require('../controllers/marieController');

router.post('/register', MarieController.register);
router.post('/login', MarieController.login);

module.exports = router;