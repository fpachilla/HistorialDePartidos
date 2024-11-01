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
        res.status(500).send('Error al obtener los usuarios al ir contra la DB');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

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

app.post('/api/addHistEquipo', async (req, res) => {
    const { usuarioLocal, equipoLocal, resultadoLocal, usuarioVisitante, equipoVisitante, resultadoVisitante, fecha } = req.body;

    try {
        let pool = await sql.connect(config);

        // Normalizar equipos: ordenar alfabéticamente los usuarios
        let userEquipo_1, userEquipo_2, nombreEquipo_1, nombreEquipo_2, resultado_1, resultado_2;
        
        if (usuarioLocal < usuarioVisitante) {
            userEquipo_1 = usuarioLocal;
            nombreEquipo_1 = equipoLocal;
            resultado_1 = resultadoLocal;

            userEquipo_2 = usuarioVisitante;
            nombreEquipo_2 = equipoVisitante;
            resultado_2 = resultadoVisitante;
        } else {
            userEquipo_1 = usuarioVisitante;
            nombreEquipo_1 = equipoVisitante;
            resultado_1 = resultadoVisitante;

            userEquipo_2 = usuarioLocal;
            nombreEquipo_2 = equipoLocal;
            resultado_2 = resultadoLocal;
        }

        // Insertar el partido en la tabla Partidos
        await pool.request()
            .input('usuarioLocal', sql.VarChar, usuarioLocal)
            .input('equipoLocal', sql.VarChar, equipoLocal)
            .input('resultadoLocal', sql.Int, resultadoLocal)
            .input('usuarioVisitante', sql.VarChar, usuarioVisitante)
            .input('equipoVisitante', sql.VarChar, equipoVisitante)
            .input('resultadoVisitante', sql.Int, resultadoVisitante)
            .input('fecha', sql.DateTime, fecha)
            .query(`INSERT INTO Partidos (usuarioLocal, nombreLocal, resultadoLocal, usuarioVisita, nombreVisita, resultadoVisita, fecha) 
                    VALUES (@usuarioLocal, @equipoLocal, @resultadoLocal, @usuarioVisitante, @equipoVisitante, @resultadoVisitante, @fecha)`);

        // Verificar si ya existe un registro en Cruces para este cruce normalizado
        const result = await pool.request()
            .input('userEquipo_1', sql.VarChar, userEquipo_1)
            .input('userEquipo_2', sql.VarChar, userEquipo_2)
            .input('nombreEquipo_1', sql.VarChar, nombreEquipo_1)
            .input('nombreEquipo_2', sql.VarChar, nombreEquipo_2)
            .query(`SELECT * FROM Cruces WHERE 
                    userEquipo_1 = @userEquipo_1 AND 
                    userEquipo_2 = @userEquipo_2 AND 
                    nombreEquipo_1 = @nombreEquipo_1 AND 
                    nombreEquipo_2 = @nombreEquipo_2`);

        let ganados_1 = 0, ganados_2 = 0, empatados = 0;

        if (resultado_1 > resultado_2) {
            ganados_1 = 1;
        } else if (resultado_1 < resultado_2) {
            ganados_2 = 1;
        } else {
            empatados = 1;
        }

        if (result.recordset.length > 0) {
            // El cruce ya existe, actualizar estadísticas
            const cruce = result.recordset[0];

            ganados_1 += cruce.ganados_1;
            empatados += cruce.empatados;
            ganados_2 += cruce.ganados_2;

            // Actualizar el registro en Cruces
            await pool.request()
                .input('ganados_1', sql.Int, ganados_1)
                .input('empatados', sql.Int, empatados)
                .input('ganados_2', sql.Int, ganados_2)
                .input('userEquipo_1', sql.VarChar, userEquipo_1)
                .input('userEquipo_2', sql.VarChar, userEquipo_2)
                .input('nombreEquipo_1', sql.VarChar, nombreEquipo_1)
                .input('nombreEquipo_2', sql.VarChar, nombreEquipo_2)
                .query(`UPDATE Cruces SET 
                        ganados_1 = @ganados_1, 
                        empatados = @empatados, 
                        ganados_2 = @ganados_2 
                        WHERE userEquipo_1 = @userEquipo_1 AND 
                        userEquipo_2 = @userEquipo_2 AND 
                        nombreEquipo_1 = @nombreEquipo_1 AND 
                        nombreEquipo_2 = @nombreEquipo_2`);
        } else {
            // El cruce no existe, crear un nuevo registro
            await pool.request()
                .input('userEquipo_1', sql.VarChar, userEquipo_1)
                .input('userEquipo_2', sql.VarChar, userEquipo_2)
                .input('nombreEquipo_1', sql.VarChar, nombreEquipo_1)
                .input('nombreEquipo_2', sql.VarChar, nombreEquipo_2)
                .input('ganados_1', sql.Int, ganados_1)
                .input('empatados', sql.Int, empatados)
                .input('ganados_2', sql.Int, ganados_2)
                .query(`INSERT INTO Cruces (userEquipo_1, userEquipo_2, nombreEquipo_1, nombreEquipo_2, ganados_1, empatados, ganados_2) 
                        VALUES (@userEquipo_1, @userEquipo_2, @nombreEquipo_1, @nombreEquipo_2, @ganados_1, @empatados, @ganados_2)`);
        }

        // Actualizar los registros en la tabla Equipo según los resultados originales del partido
        let resultadoEquipoLocal, resultadoEquipoVisitante;

        if (resultadoLocal > resultadoVisitante) {
            resultadoEquipoLocal = 'ganados';
            resultadoEquipoVisitante = 'perdidos';
        } else if (resultadoLocal < resultadoVisitante) {
            resultadoEquipoLocal = 'perdidos';
            resultadoEquipoVisitante = 'ganados';
        } else {
            resultadoEquipoLocal = 'empatados';
            resultadoEquipoVisitante = 'empatados';
        }

        await pool.request()
            .input('equipoLocal', sql.VarChar, equipoLocal)
            .input('usuarioLocal', sql.VarChar, usuarioLocal)
            .query(`UPDATE Equipo 
                    SET ${resultadoEquipoLocal} = ${resultadoEquipoLocal} + 1 
                    WHERE nombreEquipo = @equipoLocal AND usuario = @usuarioLocal`);

        await pool.request()
            .input('equipoVisitante', sql.VarChar, equipoVisitante)
            .input('usuarioVisitante', sql.VarChar, usuarioVisitante)
            .query(`UPDATE Equipo 
                    SET ${resultadoEquipoVisitante} = ${resultadoEquipoVisitante} + 1 
                    WHERE nombreEquipo = @equipoVisitante AND usuario = @usuarioVisitante`);

        // Lógica para la tabla CrucesUsuarios, normalizando los usuarios
        let user_1, user_2;
        
        if (usuarioLocal < usuarioVisitante) {
            user_1 = usuarioLocal;
            user_2 = usuarioVisitante;
        } else {
            user_1 = usuarioVisitante;
            user_2 = usuarioLocal;
        }

        await pool.request()
            .input('user_1', sql.VarChar, user_1)
            .input('user_2', sql.VarChar, user_2)
            .input('jugados', sql.Int, 1)
            .input('ganados_1', sql.Int, (user_1 === usuarioLocal && resultadoLocal > resultadoVisitante) || (user_1 === usuarioVisitante && resultadoVisitante > resultadoLocal) ? 1 : 0)
            .input('ganados_2', sql.Int, (user_2 === usuarioLocal && resultadoLocal > resultadoVisitante) || (user_2 === usuarioVisitante && resultadoVisitante > resultadoLocal) ? 1 : 0)
            .input('empatados', sql.Int, resultadoLocal === resultadoVisitante ? 1 : 0)
            .query(`
                IF EXISTS (
                    SELECT 1 FROM CrucesUsuarios
                    WHERE user_1 = @user_1
                    AND user_2 = @user_2
                )
                BEGIN
                    UPDATE CrucesUsuarios
                    SET
                        jugados = jugados + 1,
                        ganados_1 = CASE WHEN @ganados_1 = 1 THEN ganados_1 + 1 ELSE ganados_1 END,
                        ganados_2 = CASE WHEN @ganados_2 = 1 THEN ganados_2 + 1 ELSE ganados_2 END,
                        empatados = CASE WHEN @empatados = 1 THEN empatados + 1 ELSE empatados END
                    WHERE user_1 = @user_1
                    AND user_2 = @user_2
                END
                ELSE
                BEGIN
                    INSERT INTO CrucesUsuarios (user_1, user_2, jugados, ganados_1, empatados, ganados_2)
                    VALUES (@user_1, @user_2, @jugados, @ganados_1, @empatados, @ganados_2)
                END
            `);

        res.status(200).send('Resultado, fecha, estadísticas y tabla de equipos actualizados con éxito');
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al procesar el resultado, las estadísticas y la tabla de equipos');
    }
});

// Ruta para obtener el historial entre dos equipos de dos usuarios
app.post('/api/getHistorialEquipos', async (req, res) => {
    const { user_1, equipo_1, user_2, equipo_2 } = req.body;

    if (user_1 < user_2) {
        userNormalizado_1 = user_1;
        equipoNormalizado_1 = equipo_1;

        userNormalizado_2 = user_2;
        equipoNormalizado_2 = equipo_2;
    } else {
        userNormalizado_1 = user_2;
        equipoNormalizado_1 = equipo_2;

        userNormalizado_2 = user_1;
        equipoNormalizado_2 = equipo_1;
    }

    try {
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('userEquipo_1', sql.VarChar, userNormalizado_1)
            .input('userEquipo_2', sql.VarChar, userNormalizado_2)
            .input('nombreEquipo_1', sql.VarChar, equipoNormalizado_1)
            .input('nombreEquipo_2', sql.VarChar, equipoNormalizado_2)
            .query(`SELECT ganados_1, empatados, ganados_2 
                    FROM Cruces 
                    WHERE userEquipo_1 = @userEquipo_1 
                    AND userEquipo_2 = @userEquipo_2 
                    AND nombreEquipo_1 = @nombreEquipo_1 
                    AND nombreEquipo_2 = @nombreEquipo_2`);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send('No se encontraron registros de cruces para estos equipos.');
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al obtener el historial de cruces entre los equipos.');
    }
});

// Ruta para obtener el historial entre dos usuarios
app.post('/api/getHistorialUsuarios', async (req, res) => {
    const { user_1, user_2 } = req.body;

    if (user_1 < user_2) {
        userNormalizado_1 = user_1;
        userNormalizado_2 = user_2;
    } else {
        userNormalizado_1 = user_2;
        userNormalizado_2 = user_1;
    }

    try {
        let pool = await sql.connect(config);

        let result = await pool.request()
            .input('userNormalizado_1', sql.VarChar, userNormalizado_1)
            .input('userNormalizado_2', sql.VarChar, userNormalizado_2)
            .query(`SELECT ganados_1, empatados, ganados_2 
                    FROM CrucesUsuarios 
                    WHERE user_1 = @userNormalizado_1 
                    AND user_2 = @userNormalizado_2`);

        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset[0]);
        } else {
            res.status(404).send('No se encontraron registros de cruces entre estos usuarios.');
        }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Error al obtener el historial de cruces entre los usuarios.');
    }
});


