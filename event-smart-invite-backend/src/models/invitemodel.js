const db = require('../config/db');

const Invite = {};

// Créer un invité
Invite.create = async (data) => {
    const { nom, prenom, telephone, categorie } = data;
    const connection = await db;
    const [result] = await connection.query(
        'INSERT INTO invites (nom, prenom, telephone, categorie) VALUES (?, ?, ?, ?)',
        [nom, prenom, telephone, categorie || 'Autres']
    );
    return result;
};

// Récupérer tous les invités
Invite.getAll = async () => {
    const connection = await db;
    const [rows] = await connection.query('SELECT * FROM invites ORDER BY id DESC');
    return rows;
};

// Récupérer un invité par ID
Invite.getById = async (id) => {
    const connection = await db;
    const [rows] = await connection.query('SELECT * FROM invites WHERE id = ?', [id]);
    return rows[0];
};

// Modifier un invité
Invite.update = async (id, data) => {
    const { nom, prenom, telephone, categorie, statut } = data;
    const connection = await db;
    const [result] = await connection.query(
        'UPDATE invites SET nom=?, prenom=?, telephone=?, categorie=?, statut=? WHERE id=?',
        [nom, prenom, telephone, categorie, statut, id]
    );
    return result;
};

// Supprimer un invité
Invite.delete = async (id) => {
    const connection = await db;
    const [result] = await connection.query('DELETE FROM invites WHERE id=?', [id]);
    return result;
};

module.exports = Invite;