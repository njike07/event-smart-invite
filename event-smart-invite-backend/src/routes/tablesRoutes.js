const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/tablesControler");

// CRUD tables
router.post("/create", ctrl.createTable);
router.get("/all", ctrl.getTables);

// Assignation
router.post("/assign", ctrl.assignInvite);
router.put("/assign/:invite_id", ctrl.updateSeat);
router.delete("/assign/:invite_id", ctrl.removeInvite);

// Scan QR
router.get("/scan/:code_unique", ctrl.getSeatByQr);

// Marquer arrivé
router.put("/presence/:invite_id", ctrl.markArrived);

module.exports = router;
