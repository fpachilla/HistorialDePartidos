// Ingresar usuario

document.getElementById('form_new').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usuario = document.getElementById('user').value;

    // Envía el valor como parte de un objeto JSON
    try {
        const response = await fetch('/api/addUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario }) // Enviar como un objeto
        });

        if (response.ok) {
            alert('Usuario agregado con éxito');
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            alert('Error al agregar el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar el usuario');
    }
});

// Ver usuarios en el desplegable

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('/api/getUsuarios');
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }
        const usuarios = await response.json();
        
        const selectUserExistente = document.getElementById('userExistente');
        selectUserExistente.innerHTML = '<option value="">Seleccione un usuario</option>';
        
        usuarios.forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario;
            option.textContent = usuario;
            selectUserExistente.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
});

// Ingresar equipos

document.getElementById('form_existente').addEventListener('submit', async function(event) {
    event.preventDefault();

    const usuarioSeleccionado = document.getElementById('userExistente').value;
    const equipo = document.getElementById('equipo').value;

    // Envía el valor como parte de un objeto JSON
    try {
        const response = await fetch('/api/addEquipo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: usuarioSeleccionado,
                                   equipo: equipo }) // Enviar como un objeto
        });

        if (response.ok) {
            alert('Equipo agregado con éxito');
        } else {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            alert('Error al agregar al equipo');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar al equipo');
    }
});