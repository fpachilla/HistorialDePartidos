// Ver usuarios en el desplegable

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/getUsuarios');
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const usuarios = await response.json();
        
        const selectUser = document.getElementById('seleccionUsuario');
        
        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario;
            option.textContent = usuario;
            selectUser.appendChild(option);
        });

        // Añadir un evento para manejar el cambio de selección del usuario
        selectUser.addEventListener('change', async function(event) {
            const selectedUser = event.target.value;
            await mostrarEquipos(selectedUser);
        });

    } catch (error) {
        console.error('Error:', error);
    }
});

// Función para mostrar equipos del usuario seleccionado
async function mostrarEquipos(usuario) {
    try {
        const response = await fetch(`/api/getEquipos?usuario=${encodeURIComponent(usuario)}`);
        if (!response.ok) {
            throw new Error('Error al obtener los equipos');
        }
        const equipos = await response.json();
        
        const equiposTableBody = document.getElementById('equiposTable').getElementsByTagName('tbody')[0];
        equiposTableBody.innerHTML = ''; // Limpiar filas previas
        
        equipos.forEach(equipo => {
            const row = equiposTableBody.insertRow();
            const cell_uno = row.insertCell(0);
            cell_uno.textContent = equipo.nombreEquipo;
            const cell_dos = row.insertCell(1);
            cell_dos.textContent = equipo.ganados;
            const cell_tres = row.insertCell(2);
            cell_tres.textContent = equipo.empatados;
            const cell_cuatro = row.insertCell(3);
            cell_cuatro.textContent = equipo.perdidos;
            const cell_cinco = row.insertCell(4);
            cell_cinco.textContent = equipo.copas;
            const cell_seis = row.insertCell(5);
            cell_seis.textContent = equipo.copas_de_copas;
        });

    } catch (error) {
        console.error('Error:', error);
    }
}
