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
        alert("Debes terminar la partida antes de ver las estadísticas.");
        return;

    }else{window.location.href = "../index.html"}
    
}



function irAEstadisticas() {
    let tablero = obtenerTablero()
    if (!tablero){window.location.href = "../estadisticas/index.html";return}

    if (verificarEstadoJuego(tablero) == "cierre") {
        alert("Debes terminar la partida antes de ver las estadísticas.");
        return;

    }else{window.location.href = "../estadisticas/index.html"}
   
}

function finalizarPartida(idPartida, estado, idUsuario, nombreJuego) {
    fetch(`/finalizar_partida/${idPartida}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: estado, id_usuario: idUsuario, nombre_juego: nombreJuego }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function obtenerIdPartida(idUsuario, nombreJuego, estado) {
    fetch(`/obtener_id_partida/${idUsuario}/${nombreJuego}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo obtener el ID de la partida.');
        }
        return response.json();
    })
    .then(data => {
        let idPartida = data.id_partida;
        finalizarPartida(idPartida, estado, idUsuario, nombreJuego);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function finalizarPartidaActual(estado) {
    let tablero = obtenerTablero();

    if (tablero && !comprobarGanador(tablero, CRUZ) && !comprobarGanador(tablero, CIRCULO) && !todasCasillasOcupadas(tablero)) {
        obtenerIdPartida(idUsuario, nombreJuego, estado);
    } else {
        console.log("No hay partida en curso para finalizar.");
    }
}
