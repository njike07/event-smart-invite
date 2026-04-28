const db = require('../config/db');

const AlbumController = {};

AlbumController.createAlbum = async (req, res) => {
    const { nom, description } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO albums (nom, description) VALUES (?, ?)',
            [nom, description]
        );
        res.status(201).json({ message: 'Album créé', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

AlbumController.getAlbums = async (req, res) => {
    try {
        const [albums] = await db.query('SELECT * FROM albums ORDER BY date_creation DESC');
        res.json(albums);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = AlbumController;