const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardControler');

// Dashboard global
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
