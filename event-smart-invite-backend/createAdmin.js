const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function createDefaultAdmin() {
    try {
        const username = 'admin';
        const password = 'admin123';
        const telephone = '0612345678';
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO admins (username, password, telephone) VALUES (?, ?, ?)',
            [username, hashedPassword, telephone]
        );
        
        console.log('✅ Admin créé avec succès !');
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Téléphone:', telephone);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

createDefaultAdmin();
