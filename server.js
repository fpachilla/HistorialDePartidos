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
// Este middleware transforma el cuerpo de las solicitudes HTTP que lleguen con contenido JSON.
// Convierte el JSON recibido en un objeto JavaScript accesible desde req.body en los manejadores de rutas
app.use(bodyParser.json());

// Este middleware configura un servidor estático para servir archivos desde el directorio public.
// Si tengo archivos HTML, CSS, JavaScript o imágenes en public, se pueden acceder directamente desde el navegador
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});





