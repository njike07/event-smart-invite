const db = require('./src/config/db');

async function testDB() {
    try {
        const connection = await db;
        const [rows] = await connection.query('SELECT 1 + 1 AS result');
        console.log('Connexion MySQL OK', rows);
    } catch (err) {
        console.error('Erreur connexion MySQL :', err);
    }
}

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);
const inviteRoutes = require('./src/routes/inviteRoutes');
app.use('/api/invites', inviteRoutes);
const marieRoutes = require('./src/routes/marieRoutes');
app.use('/api/maries', marieRoutes);
const albumRoutes = require('./src/routes/albumRoutes');
app.use('/api/albums', albumRoutes);
const photographeRoutes = require('./src/routes/photographeRoutes');
app.use('/api/photographe', photographeRoutes);


app.get('/', (req, res) => {
    res.send('Backend Event Smart Invite fonctionne !');
});

//testDB();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});