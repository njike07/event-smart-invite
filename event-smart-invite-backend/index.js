const db = require('./src/config/db');

async function getAdmins() {
  try {
    const [rows] = await db.query('SELECT username, telephone FROM admins');
    
    console.log('--- Connected to MariaDB ---');
    console.log('Admin Users found:');
    console.table(rows); 
    
  } catch (err) {
    console.error('Error connecting to the database:', err.message);
  } finally {
    process.exit();
  }
}

getAdmins();
