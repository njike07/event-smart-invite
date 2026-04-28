const express = require('express');
const router = express.Router();
const programmeController = require('../controllers/programmeControler');

router.post('/', programmeController.addEvent);
router.get('/', programmeController.getAllEvents);
router.put('/:id', programmeController.updateEvent);
router.delete('/:id', programmeController.deleteEvent);

module.exports = router;
