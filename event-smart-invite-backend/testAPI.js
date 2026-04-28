const axios = require('axios');

async function testAPI() {
    try {
        console.log('🔍 Test de connexion API...\n');
        
        // Test 1: Vérifier que le serveur répond
        console.log('1. Test du serveur...');
        const serverTest = await axios.get('http://localhost:5000');
        console.log('✅ Serveur OK:', serverTest.data);
        
        // Test 2: Test login admin
        console.log('\n2. Test login admin...');
        const loginTest = await axios.post('http://localhost:5000/auth/login', {
            telephone: '0612345678',
            password: 'admin123'
        });
        console.log('✅ Login OK:', loginTest.data);
        
    } catch (error) {
        console.error('❌ Erreur API:', error.response?.data || error.message);
    }
}

testAPI();