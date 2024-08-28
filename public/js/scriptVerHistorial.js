document.addEventListener('DOMContentLoaded', function () {
    const histEquiposButton = document.querySelector('#histEquipos');
    const histUsuariosButton = document.querySelector('#histUsuarios');
    const formEquipos = document.querySelector('#formEquipos');
    const formUsuarios = document.querySelector('#formUsuarios');
    const usuarioUnoSelectEquipos = document.querySelector('#usuarioUno');
    const equipoUnoSelect = document.querySelector('#equipoUno');
    const usuarioDosSelectEquipos = document.querySelector('#usuarioDos');
    const equipoDosSelect = document.querySelector('#equipoDos');
    const usuarioUnoSelectUsuarios = document.querySelector('#usuarioUnoUsuarios');
    const usuarioDosSelectUsuarios = document.querySelector('#usuarioDosUsuarios');
    const historialResultados = document.querySelector('#historialResultados');
    const formEquiposSubmit = document.querySelector('#formEquiposSubmit');

    // Función para poblar los usuarios en los select
    async function cargarUsuarios() {
        console.log('Se llamó a cargarUsuarios')
        try {
            const response = await fetch('/api/getUsuarios');
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const usuarios = await response.json();

            const selectUserLocal = document.getElementById('usuarioUno');
            const selectUserVisitante = document.getElementById('usuarioDos');

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario;
                option.textContent = usuario;
                selectUserLocal.appendChild(option);

                const optionClone = option.cloneNode(true);
                selectUserVisitante.appendChild(optionClone);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
    
    // Función para poblar los equipos según el usuario seleccionado
    async function cargarEquipos(selectUserId, selectEquipoId) {
        // Se llamó a cargarEquipos
        const usuarioSeleccionado = document.getElementById(selectUserId).value;

        if (usuarioSeleccionado) {
            try {
                const response = await fetch(`/api/getEquiposPorUsuario?usuario=${usuarioSeleccionado}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los equipos');
                }
                const equipos = await response.json();

                const selectEquipo = document.getElementById(selectEquipoId);

                equipos.forEach(equipo => {
                    const option = document.createElement('option');
                    option.value = equipo;
                    option.textContent = equipo;
                    selectEquipo.appendChild(option);
                });

                // Habilitar el select de equiposUno
                document.getElementById(selectEquipoId).disabled = false;
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // Cargar usuarios al cargar la página
    cargarUsuarios();
    
    document.getElementById('usuarioUno').addEventListener('change', function() {
        cargarEquipos('usuarioUno', 'equipoUno');
    });
    
    document.getElementById('usuarioDos').addEventListener('change', function() {
        cargarEquipos('usuarioDos', 'equipoDos');
    });

    // Evento para mostrar el formulario de equipos
    histEquiposButton.addEventListener('click', function () {
        formEquipos.style.display = 'block';
        formUsuarios.style.display = 'none';
        formEquiposSubmit.disabled = true; // Inicialmente deshabilitar el botón submit
    });

    // Evento para mostrar el formulario de usuarios
    histUsuariosButton.addEventListener('click', function () {
        formUsuarios.style.display = 'block';
        formEquipos.style.display = 'none';
    });

    equipoUnoSelect.addEventListener('change', function () {
        // Habilitar el select de usuarioDos
        document.getElementById('usuarioDos').disabled = false;
    });

    equipoDosSelect.addEventListener('change', function () {
        // Habilitar botón submit solo si todos los selects tienen una opción seleccionada
        document.getElementById('submitEquipos').disabled = false;
    });

    // Manejo del envío de formularios
    formEquiposSubmit.addEventListener('submit', async function (e) {
        e.preventDefault();
        const user_1 = usuarioUnoSelectEquipos.value;
        const equipo_1 = equipoUnoSelect.value;
        const user_2 = usuarioDosSelectEquipos.value;
        const equipo_2 = equipoDosSelect.value;

        try {
            // Obtener historial entre equipos
            const responseEquipos = await fetch('/api/getHistorialEquipos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_1, equipo_1, user_2, equipo_2 })
            });

            if (responseEquipos.ok) {
                const historialEquipos = await responseEquipos.json();
                historialResultados.innerHTML = `
                    <h3>Historial entre Equipos:</h3>
                    <p>${equipo_1} (${user_1}) vs ${equipo_2} (${user_2})</p>
                    <p>Ganados por ${equipo_1}: ${historialEquipos.ganados_1}</p>
                    <p>Empatados: ${historialEquipos.empatados}</p>
                    <p>Ganados por ${equipo_2}: ${historialEquipos.ganados_2}</p>
                `;
            } else if (responseEquipos.status === 404) {
                historialResultados.innerHTML = `<p>No se encontraron registros de cruces para estos equipos.</p>`;
            } else {
                throw new Error('Error al obtener el historial de equipos');
            }

            // Obtener historial entre usuarios
            const responseUsuarios = await fetch('/api/getHistorialUsuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_1, user_2 })
            });

            if (responseUsuarios.ok) {
                const historialUsuarios = await responseUsuarios.json();
                historialResultados.innerHTML += `
                    <h3>Historial entre Usuarios:</h3>
                    <p>${user_1} vs ${user_2}</p>
                    <p>Ganados por ${user_1}: ${historialUsuarios.ganados_1}</p>
                    <p>Empatados: ${historialUsuarios.empatados}</p>
                    <p>Ganados por ${user_2}: ${historialUsuarios.ganados_2}</p>
                `;
            } else if (responseUsuarios.status === 404) {
                historialResultados.innerHTML += `<p>No se encontraron registros de cruces entre estos usuarios.</p>`;
            } else {
                throw new Error('Error al obtener el historial de usuarios');
            }
        } catch (error) {
            console.error(error);
            historialResultados.innerHTML = `<p>Ocurrió un error al obtener los historiales.</p>`;
        }
    });
});
