const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = {};

// Créer un admin
Admin.create = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await db;
    const [result] = await connection.query(
        'INSERT INTO admins (username, password) VALUES (?, ?)',
        [username, hashedPassword]
    );
    return result;
};

// Trouver un admin par username
Admin.findByUsername = async (username) => {
    const connection = await db;
    const [rows] = await connection.query(
        'SELECT * FROM admins WHERE username = ?',
        [username]
    );
    return rows[0];
};

// Trouver un admin par téléphone
Admin.findByTelephone = async (telephone) => {
    const connection = await db;
    const [rows] = await connection.query(
        'SELECT * FROM admins WHERE telephone = ?',
        [telephone]
    );
    return rows[0];
};

module.exports = Admin;