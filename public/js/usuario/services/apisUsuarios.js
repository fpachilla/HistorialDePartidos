// Ruta para agregar un usuario
app.post('/api/addUsuario', async (req, res) => {
    const { usuario } = req.body;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query('INSERT INTO Usuarios (usuario) VALUES (@usuario)');

        res.status(200).send('Usuario agregado con éxito');
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al agregar el usuario');
    }
});

// Ruta para obtener la lista de usuarios
app.get('/api/getUsuarios', async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT usuario FROM Usuarios');
        
        const usuarios = result.recordset.map(row => row.usuario);
        res.status(200).json(usuarios);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al obtener los usuarios');
    }
});