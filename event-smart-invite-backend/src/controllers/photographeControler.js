const db = require('../config/db');

// 📌 UPLOAD PHOTO (photographe)
exports.uploadPhoto = async (req, res) => {
    const { album_id, utilisateur_id } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: "Aucune image reçue." });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO photos (album_id, utilisateur_id, url, statut) VALUES (?,?,?, 'en_attente')",
            [album_id, utilisateur_id, req.file.path]
        );

        res.status(201).json({
            message: "Photo uploadée avec succès.",
            id: result.insertId,
            url: req.file.path
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// 📌 LISTE DES PHOTOS EN ATTENTE (admin)
exports.listPendingPhotos = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM photos WHERE statut = 'en_attente'"
    );

    res.json(rows);
};

// 📌 VALIDER / REJETER PHOTO (admin)
exports.updatePhotoStatus = async (req, res) => {
    const { photo_id } = req.params;
    const { statut } = req.body; // 'valide' | 'rejete'

    if (!['valide', 'rejete'].includes(statut)) {
        return res.status(400).json({ message: "Statut invalide" });
    }

    await db.query(
        "UPDATE photos SET statut = ? WHERE id = ?",
        [statut, photo_id]
    );

    res.json({ message: "Statut mis à jour", statut });
};

// 📌 AFFICHER LES PHOTOS VALIDÉES
exports.getValidPhotos = async (req, res) => {
    const [rows] = await db.query(
        "SELECT * FROM photos WHERE statut = 'valide'"
    );
    res.json(rows);
};
