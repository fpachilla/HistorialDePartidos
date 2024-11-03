<script>
  export default {
    // Importaciones de componentes que necesito
    name: 'Home', //Nombre de la página
    components: { } //Componentes importados que necesito
  }
</script>

<template>
  <main>
    <div class="contenedor_inicio">
      <h1>Empecemos</h1>

      <div class="contenedor_botones">
        <!-- Estos botones están bien o eran otros?-->
        <button>Ingresar equipo</button> <!--href="ingresoEquipos.html"--> 
        <button>Ingresar partido</button> <!--href="ingresoResultados.html"-->
      </div>

      <div class="contenedor_enlace">
        <a href="">¿Cómo funciona?</a>
      </div>
    </div>
  </main>
</template>

<style scoped>
  main {
    margin: auto;
    padding: 10em 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: greenyellow;
  }

  h1{
    font-size: 4em;
    padding: 0.8em;
  }
  .contenedor_botones{
    display: flex;
    justify-content: space-between;
  }

  .contenedor_botones button{
    padding: 1em;
    border-radius: 0.5em;
    background-color: azure;
  }

  .contenedor_enlace {
    text-align: center;
    margin: 2em 0;
  }
  .contenedor_enlace a{
    text-decoration: none;
  }
  .contenedor_enlace a:hover{
    text-decoration: underline;
  }
</style>