const db = require('../config/db');

// 📌 Ajouter un message au livre d'or
exports.addMessage = async (req, res) => {
    const { utilisateur_id, message } = req.body;

    if (!utilisateur_id || !message) {
        return res.status(400).json({ message: "Champs manquants." });
    }

    try {
        await db.query(
            "INSERT INTO livre_dor (utilisateur_id, message) VALUES (?, ?)",
            [utilisateur_id, message]
        );

        res.status(201).json({ message: "Message ajouté au livre d'or !" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// 📌 Récupérer les messages visibles (public)
exports.getVisibleMessages = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT l.id, l.message, l.date_post, u.nom, u.prenom FROM livre_dor l JOIN utilisateurs u ON l.utilisateur_id = u.id WHERE l.statut = 'visible' ORDER BY l.date_post DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// 📌 Récupérer tous les messages (admin)
exports.getAllMessages = async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT l.*, u.nom, u.prenom FROM livre_dor l JOIN utilisateurs u ON l.utilisateur_id = u.id ORDER BY l.date_post DESC"
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};

// 📌 Modifier statut : cacher / rendre visible (admin)
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { statut } = req.body;

    if (!['visible', 'cache'].includes(statut)) {
        return res.status(400).json({ message: "Statut invalide." });
    }

    try {
        await db.query(
            "UPDATE livre_dor SET statut = ? WHERE id = ?",
            [statut, id]
        );

        res.json({ message: "Statut mis à jour." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur." });
    }
};
