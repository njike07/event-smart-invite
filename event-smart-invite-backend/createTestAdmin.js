const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function createTestAdmin() {
    try {
        console.log('🔧 Création d\'un admin de test...');
        
        // Vérifier si la table existe et sa structure
        const [tables] = await db.query("SHOW TABLES LIKE 'admins'");
        if (tables.length === 0) {
            console.log('❌ Table admins n\'existe pas. Créons-la...');
            await db.query(`
                CREATE TABLE admins (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(50) NOT NULL,
                    telephone VARCHAR(20) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);
            console.log('✅ Table admins créée');
        }
        
        // Vérifier si admin existe déjà
        const [existing] = await db.query('SELECT * FROM admins WHERE telephone = ?', ['0612345678']);
        if (existing.length > 0) {
            console.log('⚠️ Admin existe déjà avec ce téléphone');
            return;
        }
        
        // Créer l'admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.query(
            'INSERT INTO admins (username, telephone, password) VALUES (?, ?, ?)',
            ['admin', '0612345678', hashedPassword]
        );
        
        console.log('✅ Admin créé avec succès !');
        console.log('📱 Téléphone: 0612345678');
        console.log('🔒 Mot de passe: admin123');
        
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        process.exit(0);
    }
}

createTestAdmin();