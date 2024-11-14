// Función para poblar los usuarios en los select
async function cargarUsuarios() {
    try {
        const response = await fetch('/api/getUsuarios');
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const usuarios = await response.json();

        const selectUserLocal = document.getElementById('userLocal');
        const selectUserVisitante = document.getElementById('userVisitante');

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
    const usuarioSeleccionado = document.getElementById(selectUserId).value;

    if (usuarioSeleccionado) {
        try {
            const response = await fetch(`/api/getEquiposPorUsuario?usuario=${usuarioSeleccionado}`);
            if (!response.ok) {
                throw new Error('Error al obtener los equipos');
            }
            const equipos = await response.json();

            const selectEquipo = document.getElementById(selectEquipoId);
            selectEquipo.innerHTML = '<option value="" disabled selected>Seleccione un equipo</option>';

            equipos.forEach(equipo => {
                const option = document.createElement('option');
                option.value = equipo;
                option.textContent = equipo;
                selectEquipo.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// Función para habilitar los inputs de resultados
function habilitarInputs() {
    const equipoLocalSeleccionado = document.getElementById('equipoLocal').value;
    const equipoVisitanteSeleccionado = document.getElementById('equipoVisitante').value;

    const resultadoLocal = document.getElementById('resultadoLocal');
    const resultadoVisitante = document.getElementById('resultadoVisitante');

    if (equipoLocalSeleccionado && equipoVisitanteSeleccionado) {
        resultadoLocal.disabled = false;
        resultadoVisitante.disabled = false;
    } else {
        resultadoLocal.disabled = true;
        resultadoVisitante.disabled = true;
    }
}

// Eventos para cargar los equipos y habilitar los inputs
document.getElementById('userLocal').addEventListener('change', function() {
    cargarEquipos('userLocal', 'equipoLocal');
});

document.getElementById('userVisitante').addEventListener('change', function() {
    cargarEquipos('userVisitante', 'equipoVisitante');
});

document.getElementById('equipoLocal').addEventListener('change', habilitarInputs);
document.getElementById('equipoVisitante').addEventListener('change', habilitarInputs);

// Cargar usuarios al cargar la página
document.addEventListener('DOMContentLoaded', cargarUsuarios);

// Evento para manejar el envío del formulario
document.getElementById('ingresoResultado').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener los valores seleccionados y los resultados
    const usuarioLocal = document.getElementById('userLocal').value;
    const equipoLocal = document.getElementById('equipoLocal').value;
    const resultadoLocal = document.getElementById('resultadoLocal').value;

    const usuarioVisitante = document.getElementById('userVisitante').value;
    const equipoVisitante = document.getElementById('equipoVisitante').value;
    const resultadoVisitante = document.getElementById('resultadoVisitante').value;

    // Generar la fecha actual ajustada a UTC-3
    const fecha = new Date();
    fecha.setHours(fecha.getHours() - 3); // Ajuste de UTC a UTC-3
    const fechaUTC3 = fecha.toISOString(); // Convertir a formato ISO

    // Enviar los valores al servidor
    try {
        const response = await fetch('/api/addHistEquipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuarioLocal,
                equipoLocal,
                resultadoLocal,
                usuarioVisitante,
                equipoVisitante,
                resultadoVisitante,
                fecha: fechaUTC3
            })
        });

        if (response.ok) {
            alert('Resultado y fecha agregados con éxito');
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            alert('Error al agregar el resultado y la fecha');
        }

        // Limpiar los input
        document.getElementById('resultadoLocal').value = '';
        document.getElementById('resultadoVisitante').value = '';

        // Limpiar los select
        document.getElementById('equipoLocal').selectedIndex = 0;
        document.getElementById('equipoVisitante').selectedIndex = 0;

    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el resultado y la fecha');
    }
});


