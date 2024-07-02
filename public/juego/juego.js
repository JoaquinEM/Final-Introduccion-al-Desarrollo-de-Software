let CRUZ = "X"
let CIRCULO = "O"
let VACIO = "-"
let estado_inicial = "disponible"
let estado_final = "ocupado"

let partidaCount = 0; // el contador de partidas quizas nos sirve para las estadisticas

function nuevaPartida() {
    console.log(Date.parse())
    partidaCount++;
    if (partidaCount > 1){
        borrarPartidaAnterior()
    }
    
    const partidaHTML = `
        <div class="tabla" id="partida_en_curso${partidaCount}">
            
            <button name="equis" id="0" onclick="agregarCruz(0, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="1" onclick="agregarCruz(1, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="2" onclick="agregarCruz(2, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="3" onclick="agregarCruz(3, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="4" onclick="agregarCruz(4, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="5" onclick="agregarCruz(5, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="6" onclick="agregarCruz(6, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="7" onclick="agregarCruz(7, ${partidaCount})" value="disponible">*</button>
            <button name="equis" id="8" onclick="agregarCruz(8, ${partidaCount})" value="disponible">*</button>
        </div>`;
    document.getElementById('partida_en_curso').innerHTML += partidaHTML;
    document.getElementById('estadistica').innerHTML = "";
}

function borrarPartidaAnterior(){
    document.getElementById('partida_en_curso').innerHTML = "";
}

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
    console.log(casilla.length)
    if (casilla.length == 0){
        return false
    }
    
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
    if (ganador == "X"){
        ganador = "¡Ganaste!"}
    else if (ganador == "O"){
        ganador = "¡Perdiste!"}
    else {ganador = "¡Empate!"}
    const estadisticaHTML = `
        <br></br>
        <h1>Partida Finalizada ${ganador}</h1>`;
    document.getElementById("estadistica").innerHTML = estadisticaHTML;
    console.log(document.getElementById("estadistica").innerHTML)
    // Aca tenemos que agregar lógica adicional para finalizar el juego,
    // como deshabilitar el tablero, mostrar un mensaje, mandar datos a estadisticas, etc.
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
    return "cierre"
}

function confirmarVolver(){
    let tablero = obtenerTablero()
    if (!tablero){window.location.href = "../index.html";return}

    if (verificarEstadoJuego(tablero) == "cierre") {
        let cierre = window.confirm("¿Desea abandonar la partida? Se perderá todo el progreso.")
        if (cierre){
            window.location.href = "../index.html"
            return
        }
    }else{window.location.href = "../index.html"}
}