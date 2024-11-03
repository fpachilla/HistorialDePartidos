<template>
  <Header></Header> 
  <router-view></router-view>
  <Footer></Footer>
</template>


<script>
import Header from './components/header/Header.vue';
import Footer from './components/footer/Footer.vue';
  
export default {
    name: 'App',
    components: {
      Header,
      Footer
    }
  }
</script>

<style scoped>
/**scoped se utiliza para "aclarar" que los estilos se aplican sólo a este componente */
</style>
