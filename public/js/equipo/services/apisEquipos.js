// Ruta para agregar un equipo
app.post('/api/addEquipo', async (req, res) => {
    const { usuario, equipo } = req.body;

    try {
        let pool = await sql.connect(config);
        await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .input('equipo', sql.VarChar, equipo)
            .query('INSERT INTO Equipo (nombreEquipo, usuario) VALUES (@equipo, @usuario)');

        res.status(200).send('Equipo agregado con éxito');
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al agregar el equipo');
    }
});

// Ruta para obtener la lista de equipos de un usuario
app.get('/api/getEquipos', async (req, res) => {
    const usuario = req.query.usuario;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query('SELECT nombreEquipo, ganados, empatados, perdidos, copas, copas_de_copas FROM Equipo WHERE usuario = @usuario');
        
        const equipos = result.recordset;
        res.status(200).json(equipos);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al obtener los equipos');
    }
});

// Ruta para obtener los equipos de un usuario específico
app.get('/api/getEquiposPorUsuario', async (req, res) => {
    const { usuario } = req.query;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('usuario', sql.VarChar, usuario)
            .query('SELECT nombreEquipo FROM Equipo WHERE usuario = @usuario');
        
        const equipos = result.recordset.map(row => row.nombreEquipo);
        res.status(200).json(equipos);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al obtener los equipos');
    }
});