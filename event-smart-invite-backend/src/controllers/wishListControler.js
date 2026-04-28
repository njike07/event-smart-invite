const Wishlist = require('../models/wishListModel');

exports.addWish = async (req, res) => {
    const { inviteId, cadeau, description } = req.body;

    try {
        await Wishlist.createWish(inviteId, cadeau, description);
        res.json({ message: "Cadeau ajouté avec succès" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getWishlistByInvite = async (req, res) => {
    try {
        const [rows] = await Wishlist.getWishlistByInvite(req.params.inviteId);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllWishlist = async (req, res) => {
    try {
        const [rows] = await Wishlist.getAll();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateWish = async (req, res) => {
    const { cadeau, description, statut } = req.body;

    try {
        await Wishlist.updateWish(req.params.id, cadeau, description, statut);
        res.json({ message: "Souhait mis à jour" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteWish = async (req, res) => {
    try {
        await Wishlist.deleteWish(req.params.id);
        res.json({ message: "Souhait supprimé" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
