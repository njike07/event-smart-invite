const db = require('../config/db');

module.exports = {
    createWish: async (inviteId, cadeau, description) => {
        const connection = await db;
        const [result] = await connection.query(
            "INSERT INTO wishlist (invite_id, cadeau, description) VALUES (?, ?, ?)",
            [inviteId, cadeau, description]
        );
        return result;
    },

    getWishlistByInvite: async (inviteId) => {
        const connection = await db;
        const [rows] = await connection.query("SELECT * FROM wishlist WHERE invite_id = ?", [inviteId]);
        return rows;
    },

    getAll: async () => {
        const connection = await db;
        const [rows] = await connection.query("SELECT w.*, i.nom, i.prenom FROM wishlist w JOIN invites i ON w.invite_id = i.id");
        return rows;
    },

    updateWish: async (id, cadeau, description, statut) => {
        const connection = await db;
        const [result] = await connection.query(
            "UPDATE wishlist SET cadeau=?, description=?, statut=? WHERE id=?",
            [cadeau, description, statut, id]
        );
        return result;
    },

    deleteWish: async (id) => {
        const connection = await db;
        const [result] = await connection.query("DELETE FROM wishlist WHERE id=?", [id]);
        return result;
    }
};