
let CRUZ = "X"
let CIRCULO = "O"
let VACIO = "-"
let estado_inicial = "disponible"
let estado_final = "ocupado"

function comprobador(tablero,ganador,arranque,suma){

    let segundaPosicion = arranque + suma

    if (tablero[arranque] == tablero[arranque+suma] && 
        tablero[arranque+suma] == tablero[segundaPosicion+suma] && 
        tablero[segundaPosicion+suma] == `${ganador}`){
        return true
    }
    return false
}

function inicializacionJuego(){
    let tablero = new Array(9)
    for (let i = 0; i < tablero.length; i++){
        tablero[i] = VACIO
    }
    return tablero
}

function obtenerTablero(){
    let tablero = inicializacionJuego()

    let casilla = document.getElementsByName("equis")
    
    for (let posicion = 0; posicion < 9; posicion++){
        if (casilla[posicion].innerText == CRUZ){
            tablero[posicion] = CRUZ
        }
        if (casilla[posicion].innerText == CIRCULO){
            tablero[posicion] = CIRCULO
        }
    }
    return tablero
}

function comprobarGanador(tablero, ganador) {
    return comprobador(tablero, ganador, 0, 1) || 
           comprobador(tablero, ganador, 3, 1) || 
           comprobador(tablero, ganador, 6, 1) || 
           comprobador(tablero, ganador, 0, 3) || 
           comprobador(tablero, ganador, 1, 3) || 
           comprobador(tablero, ganador, 2, 3) || 
           comprobador(tablero, ganador, 0, 4) || 
           comprobador(tablero, ganador, 2, 2);
}

function agregarCirculo(veces) {
    let casillas = document.getElementsByName("equis");
    let casillasDisponibles = [];

    for (let casilla of casillas) {
        if (casilla.getAttribute("value") === estado_inicial) {
            casillasDisponibles.push(casilla);
        }
    }

    if (casillasDisponibles.length === 0) {
        return true; // No hay movimientos disponibles, el juego debe terminar
    }

    let posicion = Math.floor(Math.random() * casillasDisponibles.length);
    let casilla = casillasDisponibles[posicion]
    casilla.innerText = CIRCULO
    casilla.setAttribute("value", estado_final)

    let tablero = obtenerTablero()
    verificarEstadoJuego(tablero) 
    return false;
}


function agregarCruz(id){
    let casilla = document.getElementById(`${id}`)
    let estado_casilla = casilla.getAttribute('value')

    let tablero = obtenerTablero();
    if (comprobarGanador(tablero, CRUZ) || comprobarGanador(tablero, CIRCULO)) {
        return;
    }

    if (estado_casilla !== estado_final ) {
        casilla.innerText = CRUZ
        casilla.setAttribute("value", estado_final)

        let tablero = obtenerTablero()
        verificarEstadoJuego(tablero)

        if (!comprobarGanador(tablero, CRUZ)){
            agregarCirculo(CIRCULO)
        }

    }

}

function terminarJuego(ganador) {
    console.log("El juego ha terminado")
    console.log(`GANÓ: ${ganador}`)
    // Aquí puedes agregar cualquier lógica adicional para finalizar el juego,
    // como deshabilitar el tablero, mostrar un mensaje, etc.
}

function todasCasillasOcupadas(tablero) {
    return tablero.every(casilla => casilla !== VACIO)
}

function verificarEstadoJuego(tablero) {
    if (comprobarGanador(tablero, CRUZ)) {
        terminarJuego(CRUZ)
        return
    }

    if (comprobarGanador(tablero, CIRCULO)) {
        terminarJuego(CIRCULO)
        return
    }

    if (todasCasillasOcupadas(tablero)) {
        terminarJuego("Empate")
        return
    }

    console.log("El juego continúa")
}



// --------------- FUNCION ANTIGUA DE AGREGAR CIRCULO--------------
/* 
function agregarCirculo(veces){
    let posicion = Math.floor(Math.random() * 9)
    let casillas = document.getElementsByName("equis")
    
    if (casillas[posicion].getAttribute("value") === estado_final){
        veces += 1
        if (veces >= 9){
            verificarEstadoJuego(obtenerTablero())
            return true //no hay movimientos disponibles
        }else{
            return agregarCirculo(veces)
        }
        
       
    }
    for (let casilla = 0; casilla < 9; casilla++){
        if (casillas[casilla].getAttribute("value") == estado_inicial && casillas[casilla].getAttribute("id") == posicion){
            casillas[casilla].innerText = CIRCULO
            casillas[casilla].setAttribute("value",estado_final)
            let tablero = obtenerTablero()
            verificarEstadoJuego(obtenerTablero())
            return false
        }
    }
    
}
*/