<template>

<div></div>
    <h2>Crear usuario nuevo</h2>
    <form @submit="formularioIngresoUsuario">
        <label for="usuarioNuevo">Nombre del usuario</label>
        <input type="text" name="usuarioNuevo" id="user" v-model="usuarioNuevo"><br>
        <input type="submit" value="Ingresar usuario"></input><br>
    </form>

    <h2>Ingresar equipo para un usuario existente</h2>
    <form @submit="formularioIngresoEquipo">
        <label for="usuarioExistente">Nombre del usuario</label>
        <select name="usuarioExistente" id="userExistente" v-model="usuariosExistentes">
            <option v-for="u in usuariosExistentes" :key="u" :value="u">
                {{ u }}
            </option>
        </select>
        <br>
        <label for="equipo">Nombre del equipo</label>
        <input type="text" name="equipo" id="equipo"><br>
        <button>Ingresar equipo</button>
    </form>

</template>
<script>
    // Ingresar usuario
    export default{
        data(){
            return {
                usuarioNuevo: "",
                usuariosExistentes: []
            };
        },
        methods:{
            formularioIngresoUsuario(event){
                event.preventDefault();
                console.log("usuarioNuevo: ", this.usuarioNuevo)
            },

            formularioIngresoEquipo(event){
                event.preventDefault();
                console.log("usuarioNuevo: ", this.usuarioNuevo)
            },
        },
        mounted() {
            fetch('/api/getUsuarios')
                .then(response => {
                    if (response.ok) {
                        return response.json(); // Retorna una promesa
                    } else {
                        throw new Error('Error en la respuesta de la API');
                    }
                })
                .then(data => {
                    this.usuariosExistentes = data;     
                    console.log("Usuarios existentes", this.usuariosExistentes);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }, 
        /*created(){
            try {
                const response =  fetch('/api/addUsuario', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.usuarioNuevo) // Enviar como un objeto
                });
                console.log("llamado")
                if (response.ok) {
                        alert('Usuario agregado con éxito');
                } else {
                        const errorText = response.text();
                        console.error('Error response:', errorText);
                        alert('Error al agregar el usuario');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al agregar el usuario');
                } 
        }*/
    }   


// Ver usuarios en el desplegable
/*
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
});*/
</script>
<style>
</style>