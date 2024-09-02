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
    const formUsuariosSubmit = document.querySelector('#formUsuariosSubmit');

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
            const selectUserLocalUsuarios = document.getElementById('usuarioUnoUsuarios');
            const selectUserVisitanteUsuarios = document.getElementById('usuarioDosUsuarios');

            usuarios.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario;
                option.textContent = usuario;
                selectUserLocal.appendChild(option);

                const optionClone = option.cloneNode(true);
                selectUserVisitante.appendChild(optionClone);

                // Crear otra opción para usuarioUnoUsuarios y usuarioDosUsuarios
                const optionUsuarios = document.createElement('option');
                optionUsuarios.value = usuario;
                optionUsuarios.textContent = usuario;
                // Agregar opción a usuarioUnoUsuarios y su clon a usuarioDosUsuarios
                selectUserLocalUsuarios.appendChild(optionUsuarios);

                const optionUsuariosClone = optionUsuarios.cloneNode(true);
                selectUserVisitanteUsuarios.appendChild(optionUsuariosClone);
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
                // Limpiar las opciones anteriores
                selectEquipo.innerHTML = '<option value="">Seleccione un equipo del usuario seleccionado</option>';

                equipos.forEach(equipo => {
                    const option = document.createElement('option');
                    option.value = equipo;
                    option.textContent = equipo;
                    selectEquipo.appendChild(option);
                });

                // Habilitar el select de equiposUno
                habilitarSelect(selectEquipoId);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    // Habilitar select
    async function habilitarSelect(selectId) {
        document.getElementById(selectId).disabled = false;
    }

    // Cargar usuarios al cargar la página
    cargarUsuarios();
    
    // Evento al cambiar el usuario 1 seleccionado en el historial por equipos
    document.getElementById('usuarioUno').addEventListener('change', function() {
        const esValido = validarUsuarios('usuarioUno', 'usuarioDos');
        if (esValido) {
            cargarEquipos('usuarioUno', 'equipoUno');
        }
    });
    
    // Evento al cambiar el usuario 2 seleccionado en el historial por equipos
    document.getElementById('usuarioDos').addEventListener('change', function() {
        const esValido = validarUsuarios('usuarioUno', 'usuarioDos');
        if (esValido) {
            cargarEquipos('usuarioDos', 'equipoDos');
        }
    });

    function validarUsuarios(selectId1, selectId2) {
        const selectUserUno = document.getElementById(selectId1);
        const selectUserDos = document.getElementById(selectId2);
    
        // Obtener los valores seleccionados
        const usuarioUnoSeleccionado = selectUserUno.value;
        const usuarioDosSeleccionado = selectUserDos.value;
    
        // Validar si el usuario seleccionado en uno de los select está en el otro
        if (usuarioUnoSeleccionado === usuarioDosSeleccionado && usuarioUnoSeleccionado !== "") {
            alert('El mismo usuario no puede ser seleccionado en ambos selects.');
            
            // Opcional: Resetea el select que se acaba de cambiar
            if (selectUserUno === document.activeElement) {
                selectUserUno.value = ""; // Resetea el primer select si es el mismo usuario
            } else {
                selectUserDos.value = ""; // Resetea el segundo select si es el mismo usuario
            }
            return false;
        }
        return true;
    }

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
        formUsuariosSubmit.disabled = true; // Inicialmente deshabilitar el botón submit
    });

    // Habilitar el select de usuarioDos
    equipoUnoSelect.addEventListener('change', function () {
        document.getElementById('usuarioDos').disabled = false;
    });

    // Habilitar botón submit solo si todos los selects tienen una opción seleccionada
    equipoDosSelect.addEventListener('change', function () {
        document.getElementById('submitEquipos').disabled = false;
    });

    usuarioUnoSelectUsuarios.addEventListener('change', function () {
        const esValido = validarUsuarios('usuarioUnoUsuarios', 'usuarioDosUsuarios');
        if (esValido) {
            habilitarSelect('usuarioDosUsuarios');
        }
    });

    usuarioDosSelectUsuarios.addEventListener('change', function () {
        const esValido = validarUsuarios('usuarioUnoUsuarios', 'usuarioDosUsuarios');
        if (esValido) {
            document.getElementById('submitUsuarios').disabled = false;
        } else {
            document.getElementById('submitUsuarios').disabled = true;
    }
    });

    // Manejo del envío de formulario para equipos
    formEquiposSubmit.addEventListener('submit', async function (e) {
        e.preventDefault();
        const userPreview_1 = usuarioUnoSelectEquipos.value;
        const equipoPreview_1 = equipoUnoSelect.value;
        const userPreview_2 = usuarioDosSelectEquipos.value;
        const equipoPreview_2 = equipoDosSelect.value;

        if (userPreview_1 < userPreview_2) {
            user_1 = userPreview_1;
            equipo_1 = equipoPreview_1;
    
            user_2 = userPreview_2;
            equipo_2 = equipoPreview_2;
        } else {
            user_1 = userPreview_2;
            equipo_1 = equipoPreview_2;
    
            user_2 = userPreview_1;
            equipo_2 = equipoPreview_1;
        }

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
                const resultadoHistorialEquipos = document.getElementById('resultadoHistorialEquipos');
                resultadoHistorialEquipos.innerHTML = `
                    <h3>Historial entre Equipos:</h3>
                    <p>${equipo_1} (${user_1}) vs ${equipo_2} (${user_2})</p>
                    <p>Ganados por ${equipo_1}: ${historialEquipos.ganados_1}</p>
                    <p>Empatados: ${historialEquipos.empatados}</p>
                    <p>Ganados por ${equipo_2}: ${historialEquipos.ganados_2}</p>
                `;
            } else if (responseEquipos.status === 404) {
                resultadoHistorialEquipos.innerHTML = `<p>No se encontraron registros de cruces para estos equipos.</p>`;
            } else {
                throw new Error('Error al obtener el historial de equipos');
            }

        } catch (error) {
            console.error(error);
            resultadoHistorialEquipos.innerHTML = `<p>Ocurrió un error al obtener los historiales.</p>`;
        }
    });

    // Manejo del envío de formulario para usuarios
    formUsuariosSubmit.addEventListener('submit', async function (e) {
        console.log('Se llamó el evento del submit')
        e.preventDefault();
        const userPreview1 = usuarioUnoSelectUsuarios.value;
        const userPreview2 = usuarioDosSelectUsuarios.value;

        if (userPreview1 < userPreview2) {
            user_1 = userPreview1;
            user_2 = userPreview2;
        } else {
            user_1 = userPreview2;
            user_2 = userPreview1;
        }

        try {
            // Obtener historial entre usuarios
            const responseUsuarios = await fetch('/api/getHistorialUsuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_1, user_2 })
            });

            if (responseUsuarios.ok) {
                console.log('Dio todo ok, con user1: ' + user_1 + ' y user2: ' + user_2)
                const historialUsuarios = await responseUsuarios.json();
                const resultadoHistorialUsuarios = document.getElementById('resultadoHistorialUsuarios');
                resultadoHistorialUsuarios.innerHTML = `
                    <h3>Historial entre Usuarios:</h3>
                    <p>${user_1} vs ${user_2}</p>
                    <p>Ganados por ${user_1}: ${historialUsuarios.ganados_1}</p>
                    <p>Empatados: ${historialUsuarios.empatados}</p>
                    <p>Ganados por ${user_2}: ${historialUsuarios.ganados_2}</p>
                `;
            } else if (responseUsuarios.status === 404) {
                resultadoHistorialUsuarios.innerHTML = `<p>No se encontraron registros de cruces entre estos usuarios.</p>`;
            } else {
                throw new Error('Error al obtener el historial de usuarios');
            }
        } catch (error) {
            console.error(error);
            resultadoHistorialUsuarios.innerHTML = `<p>Ocurrió un error al obtener los historiales.</p>`;
        }
    });
});
