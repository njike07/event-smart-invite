const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
    res.send('Test minimal fonctionne !');
});

app.listen(PORT, () => {
    console.log(`Test serveur sur http://localhost:${PORT}`);
});