const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión
const config = {
    user: 'user_historial',
    password: 'CopaDeCopas2016',
    server: 'historial.database.windows.net',
    port: 1433,
    database: 'historial',
    setTimeout: '3000',
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});





