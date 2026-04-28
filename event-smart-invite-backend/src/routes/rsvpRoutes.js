const express = require('express');
const router = express.Router();
const rsvpController = require('../controllers/rsvpControler');

// Endpoint : /rsvp/:code_unique
router.post('/:code_unique', rsvpController.repondreRSVP);

module.exports = router;
