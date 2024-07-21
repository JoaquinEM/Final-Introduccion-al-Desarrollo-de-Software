/*
Pre:
    1. Debe existir un elemento HTML con el ID `partida_en_curso`.

Postcondiciones:
    1. Limpia el contenido del elemento con el ID `partida_en_curso`, eliminando la representación de la partida actual en la interfaz.

*/

function borrarPartidaAnterior(){
    document.getElementById('partida_en_curso').innerHTML = "";
}


/*
Pre:
    1. `tablero` debe ser un array que representa el estado actual del tablero del juego.
    2. `ganador` debe ser una cadena que representa el símbolo del ganador ("X" o "O").
    3. `arranque` y `suma` deben ser enteros que determinan las posiciones a verificar en el tablero.

Post:
    1. Devuelve `true` si hay una línea de tres posiciones consecutivas en el tablero con el mismo valor 
       que `ganador`; de lo contrario, devuelve `false`.

*/

function comprobador(tablero,ganador,arranque,suma){

    let segundaPosicion = arranque + suma

    if (tablero[arranque] == tablero[arranque+suma] && 
        tablero[arranque+suma] == tablero[segundaPosicion+suma] && 
        tablero[segundaPosicion+suma] == `${ganador}`){
        return true
    }
    return false
}


/*
Pre:
    -
Post:
    1. Devuelve un array de 9 elementos, todos inicializados con el valor de `VACIO`, representando un tablero vacío listo para el juego.

*/
function inicializacionJuego(){
    let tablero = new Array(9)
    for (let i = 0; i < tablero.length; i++){
        tablero[i] = VACIO
    }
    return tablero
}


/*
Pre:
    1. La función `inicializacionJuego` debe estar definida y disponible para ser llamada.
    2. Las constantes `CRUZ` y `CIRCULO` deben estar definidas y representar los valores que se pueden encontrar en las casillas del tablero (por ejemplo, "X" y "O").
    3. Debe haber elementos HTML con el atributo `name` igual a `"equis"`.

Post:
    1. Devuelve un array de 9 elementos que representa el estado actual del tablero:
        - Las posiciones con texto `CRUZ` en las casillas HTML se actualizan con el valor de `CRUZ`.
        - Las posiciones con texto `CIRCULO` en las casillas HTML se actualizan con el valor de `CIRCULO`.

    2. Si no se encuentran casillas con el atributo `name` igual a `"equis"`, devuelve `false`.

*/

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


/*
Pre:
    1. La función `comprobador` debe estar definida y disponible para ser llamada.
    2. `tablero` debe ser un array de 9 elementos que representa el estado actual del tablero del juego.
    3. `ganador` debe ser una cadena que representa el símbolo del ganador ("X" o "O").

Post:
    1. Devuelve `true` si el jugador con el símbolo `ganador` ha ganado (hay una línea de tres símbolos consecutivos en el tablero).
    2. Devuelve `false` si el jugador con el símbolo `ganador` no ha ganado (no hay ninguna línea de tres símbolos consecutivos en el tablero).
*/

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


/*
Pre:
    1. La constante `CIRCULO` debe estar definida.
    2. La constante `estado_inicial` y `estado_final` deben estar definidas
    3. La función `obtenerTablero` debe estar definida y debe devolver el estado actual del tablero.
    4. La función `verificarEstadoJuego` debe estar definida para evaluar el estado del juego.

Post:
    1. Coloca un símbolo de `CIRCULO` en una casilla disponible al azar en el tablero.
    2. Actualiza el estado de la casilla para reflejar que ha sido ocupada.
    3. Llama a `verificarEstadoJuego` para evaluar el estado del juego después del movimiento.
    4. Devuelve `true` si no hay movimientos disponibles (casillas vacías) y el juego debe terminar.
    5. Devuelve `false` si aún hay movimientos disponibles.

*/

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

/*
Pre:
    1. La constante `CRUZ` debe estar definida.
    2. La constante `estado_final` debe estar definida.
    3. La función `obtenerTablero` debe estar definida y devolver el estado actual del tablero.
    4. La función `verificarEstadoJuego` debe estar definida para evaluar el estado del juego.
    5. La función `agregarCirculo` debe estar definida y ser capaz de colocar un símbolo en una casilla.

Post:
    1. Si el juego ya tiene un ganador, no realiza ninguna acción.
    2. Si la casilla especificada no está ocupada, coloca un símbolo de `CRUZ` en la casilla y actualiza su estado.
    3. Llama a `verificarEstadoJuego` para evaluar el estado del juego después del movimiento.
    4. Si no hay un ganador con `CRUZ` después del movimiento, llama a `agregarCirculo` para hacer un movimiento automático.
*/

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


/*
Pre:
    1. `tablero` debe ser un array que representa el estado actual del tablero del juego.
    2. La constante `VACIO` debe estar definida.

Post:
    1. Devuelve `true` si todas las casillas en el tablero están ocupadas (es decir, ninguna casilla es igual a `VACIO`).
    2. Devuelve `false` si al menos una casilla en el tablero está vacía.

*/
function todasCasillasOcupadas(tablero) {
    // every es un metodo de js que nos sirve para recorrer el arreglo
    return tablero.every(casilla => casilla !== VACIO)
}



/*
Pre:
    1. `comprobarGanador` debe estar definida.
    2. `todasCasillasOcupadas` debe estar definida.
    3. `CRUZ`, `CIRCULO` deben estar definidas.
    4. `terminarJuego` debe estar definida.
    5. `tablero` debe ser un array de 9 elementos.

Post:
    1. Llama a `terminarJuego` con el ganador o "Empate" según el estado del juego.

*/

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
    return "pendiente"
}


/*
Pre:
    1. La función `obtenerTablero` debe estar definida y devolver el estado del tablero.
    2. La función `verificarEstadoJuego` debe estar definida y disponible.

Post:
    1. Si `obtenerTablero` devuelve `false` o `null`, redirige al usuario.
    2. Si `verificarEstadoJuego` devuelve `"pendiente"`, muestra una alerta y no redirige.
    3. De lo contrario, redirige al usuario

*/
function confirmarVolver(){
    let tablero = obtenerTablero()
    if (!tablero){window.location.href = "../index.html";return}

    if (verificarEstadoJuego(tablero) == "pendiente") {
        alert("Debes terminar la partida antes de ver las estadísticas.");
        return;

    }else{window.location.href = "../index.html"}
    
}

/*
Pre:
1. `obtenerTablero` y `verificarEstadoJuego` deben estar definidas.
2. `pagina` debe ser una cadena válida.

Post:
1. Redirige al usuario, si el tablero es válido y el estado del juego no es `"pendiente"`.
2. Muestra una alerta si el estado del juego es `"pendiente"`.

*/

function irAPagina(pagina) {
    let tablero = obtenerTablero()
    if (!tablero){window.location.href = `../${pagina}/index.html`;return}

    if (verificarEstadoJuego(tablero) == "pendiente") {
        alert("Debes terminar la partida antes de ver las estadísticas.");
        return;

    }else{window.location.href = `../${pagina}/index.html`}
}


/*
Pre:
    1. Los parámetros `idPartida`, `estado`, `idUsuario`, y `nombreJuego` deben estar definidos y ser válidos.

Post:
    1. Envía una solicitud para finalizar la partida con los datos proporcionados de la partida.

*/

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


/*
Pre:
    1. Los parámetros `idUsuario` y `nombreJuego` deben estar definidos y ser válidos.
    2. La función `finalizarPartida` debe estar definida y disponible.

Post:
    1. Obtiene el ID de la partida y llama a `finalizarPartida` con el ID de la partida, el estado, el ID del usuario y el nombre del juego.

*/

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


/*
Pre:
    1. La función `obtenerTablero`, `comprobarGanador`, `todasCasillasOcupadas`, y `obtenerIdPartida` deben estar definidas.
    2. Las constantes `CRUZ`, `CIRCULO`, `idUsuario`, y `nombreJuego` deben estar definidas y ser válidas (strigns).
    3. El parámetro `estado` debe estar definido y ser válido (string).

Post:
    1. Si hay una partida en curso (según el estado del tablero), llama a `obtenerIdPartida` con el estado de la partida,
       y depende del resultado finaliza o no la partida.
    
*/

function finalizarPartidaActual(estado) {
    let tablero = obtenerTablero();

    if (tablero && !comprobarGanador(tablero, CRUZ) && !comprobarGanador(tablero, CIRCULO) && !todasCasillasOcupadas(tablero)) {
        obtenerIdPartida(idUsuario, nombreJuego, estado);
    } else {
        console.log("No hay partida en curso para finalizar.");
    }
}
