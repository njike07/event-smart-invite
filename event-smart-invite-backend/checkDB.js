const db = require('./src/config/db');

async function checkDatabase() {
    try {
        console.log('🔍 Vérification de la base de données...\n');
        
        // Vérifier la table admins
        const [admins] = await db.query('DESCRIBE admins');
        console.log('✅ Structure de la table admins:');
        console.table(admins);
        
        // Compter les admins
        const [count] = await db.query('SELECT COUNT(*) as total FROM admins');
        console.log(`\n📊 Nombre d'admins: ${count[0].total}`);
        
        if (count[0].total > 0) {
            const [adminsList] = await db.query('SELECT id, username, telephone FROM admins');
            console.log('\n👥 Liste des admins:');
            console.table(adminsList);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

checkDatabase();
