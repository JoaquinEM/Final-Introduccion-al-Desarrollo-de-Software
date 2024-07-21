let CRUZ = "X"
let CIRCULO = "O"
let VACIO = "-"
let estado_inicial = "disponible"
let estado_final = "ocupado"
let partidaEnCurso = false;

let partidaCount = 0; // el contador de partidas quizas nos sirve para las estadisticas

const idUsuario = localStorage.getItem('idUsuario');
const nombreJuego = document.getElementById('nombre-juego').textContent.trim();


/*

Pre:
    1. Las variables globales `partidaEnCurso` y `partidaCount` deben estar definidas.
    2. Las funciones `finalizarPartidaActual` y `borrarPartidaAnterior` deben estar definidas.
    3. Deben existir elementos HTML con los IDs `partida_en_curso` y `resultado`.

Post:
    1. Si hay una partida en curso previa, se termina y se limpia la vista de esa partida.
    2. Incrementa el número de partidas y muestra una nueva partida en curso en la interfaz.
    3. Limpia cualquier mensaje de resultado anterior relacionado con la partida.

*/

function nuevaPartida() {
    //console.log(Date.parse())

    partidaEnCurso = true
    partidaCount++;

    if (partidaCount > 1){

        if (partidaEnCurso) {
            finalizarPartidaActual("derrota");
        }
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
        </div>
        `;
    document.getElementById('partida_en_curso').innerHTML += partidaHTML;
    document.getElementById('resultado').innerHTML = "";
}


/*
Pre:
1. La variable `ganador` debe ser una cadena de texto.
2. Debe existir una función `obtenerIdPartida` que se llama con los argumentos proporcionados.

Post:
1. Muestra un mensaje en la interfaz que indica el resultado del juego (victoria, derrota o empate).
2. Llama a `obtenerIdPartida` para registrar el resultado del juego.
3. La lógica adicional para finalizar el juego, como deshabilitar el tablero y enviar datos a las estadísticas.

*/

function terminarJuego(ganador) {
    let estado;
    if (ganador == "X"){
        estado = "victoria"
        ganador = "¡Ganaste!"}
    else if (ganador == "O"){
        estado = "derrota"
        ganador = "¡Perdiste!"}
    else {
        estado = "empate"
        ganador = "¡Empate!"
    }
    obtenerIdPartida(idUsuario, nombreJuego, estado);

    const estadisticaHTML = `
        <h1 id="fin">${ganador}</h1>`;
    document.getElementById("resultado").innerHTML = estadisticaHTML;
    //console.log(document.getElementById("resultado").innerHTML)
}
