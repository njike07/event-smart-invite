const db = require('../config/db');

// Ajouter un événement
exports.addEvent = async (req, res) => {
    const { nom, description, date_heure, lieu } = req.body;
    try {
        await db.query(
            "INSERT INTO evenements (nom, description, date_heure, lieu) VALUES (?, ?, ?, ?)",
            [nom, description, date_heure, lieu]
        );
        res.json({ message: "Événement ajouté" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Récupérer tous les événements
exports.getAllEvents = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM evenements ORDER BY date_heure ASC");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Modifier un événement
exports.updateEvent = async (req, res) => {
    const { nom, description, date_heure, lieu } = req.body;
    try {
        await db.query(
            "UPDATE evenements SET nom=?, description=?, date_heure=?, lieu=? WHERE id=?",
            [nom, description, date_heure, lieu, req.params.id]
        );
        res.json({ message: "Événement mis à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un événement
exports.deleteEvent = async (req, res) => {
    try {
        await db.query("DELETE FROM evenements WHERE id=?", [req.params.id]);
        res.json({ message: "Événement supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
