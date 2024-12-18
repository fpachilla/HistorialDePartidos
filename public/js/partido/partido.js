function partido(equipoLocal, usuarioLocal, resultadoLocal, equipoVisita, usuarioVisita, resultadoVisita){
    this.equipoLocal = equipoLocal;
    this.usuarioLocal = usuarioLocal;
    this.resultadoLocal = resultadoLocal;
    this.equipoVisita = equipoVisita;
    this.usuarioVisita = usuarioVisita;
    this.resultadoVisita = resultadoVisita;
    this.cargar = function(){
        console.log('Se crea el partido')
    };
    this.modificar = function(){
        console.log('Se modifica el partido')
    };
    this.eliminar = function(){
        console.log('Se modifica el partido')
    };
}