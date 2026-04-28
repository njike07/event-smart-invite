const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configurer multer pour stocker les images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // dossier uploads/
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('photo');

// Upload photo
exports.uploadPhoto = (req, res) => {
    upload(req, res, async function(err) {
        if (err) return res.status(500).json({ error: err.message });

        const { album_id, utilisateur_id } = req.body;
        const url = req.file.path;

        try {
            await db.query(
                "INSERT INTO photos (album_id, utilisateur_id, url, statut) VALUES (?, ?, ?, 'en_attente')",
                [album_id, utilisateur_id, url]
            );
            res.json({ message: "Photo uploadée et en attente de validation", url });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};

// Lister photos d’un album
exports.getPhotosByAlbum = async (req, res) => {
    const { album_id } = req.params;
    try {
        const [rows] = await db.query(
            "SELECT * FROM photos WHERE album_id=? ORDER BY date_upload DESC",
            [album_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
