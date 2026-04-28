const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Marie = {};

Marie.create = async (data) => {
    const { nomMarie, nomMariee, email, telephone, motDePasse, dateMariage } = data;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const connection = await db;
    const [result] = await connection.query(
        'INSERT INTO maries (nom_marie, nom_mariee, email, telephone, password, date_mariage, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [nomMarie, nomMariee, email, telephone, hashedPassword, dateMariage]
    );
    return result;
};

Marie.findByEmail = async (email) => {
    const connection = await db;
    const [rows] = await connection.query('SELECT * FROM maries WHERE email = ?', [email]);
    return rows[0];
};

Marie.findById = async (id) => {
    const connection = await db;
    const [rows] = await connection.query('SELECT * FROM maries WHERE id = ?', [id]);
    return rows[0];
};

Marie.getAll = async () => {
    const connection = await db;
    const [rows] = await connection.query('SELECT id, nom_marie, nom_mariee, email, telephone, date_mariage, created_at FROM maries ORDER BY created_at DESC');
    return rows;
};

module.exports = Marie;