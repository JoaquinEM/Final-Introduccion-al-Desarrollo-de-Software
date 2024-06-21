
let CRUZ = "X"
let CIRCULO = "O"
let VACIO = "-"
let estado_inicial = "disponible"
let estado_final = "ocupado"

function comprobador(tablero,ganador,arranque,suma){
    segundaPosicion = arranque + suma
    if (tablero[arranque] == tablero[arranque+suma] && tablero[arranque+suma] == tablero[segundaPosicion+suma] && tablero[segundaPosicion+suma] == `${ganador}`){
        console.log(`GANÓ: ${ganador}`)
    }
}

function inicializacionJuego(){
    let tablero = new Array(9)
    for (let i = 0; i < tablero.length; i++){
        tablero[i] = VACIO
    }
    return tablero
}

function comprobarGanador(ganador){
    let tablero = inicializacionJuego()

    casilla = document.getElementsByName("equis")
    
    for (let posicion = 0; posicion < 9; posicion++){
        if (casilla[posicion].innerText == CRUZ){
            tablero[posicion] = CRUZ
        }
        if (casilla[posicion].innerText == CIRCULO){
            tablero[posicion] = CIRCULO
        }
    }
    comprobador(tablero,ganador,0,1)
    comprobador(tablero,ganador,3,1)
    comprobador(tablero,ganador,6,1)

    comprobador(tablero,ganador,0,3)
    comprobador(tablero,ganador,1,3)
    comprobador(tablero,ganador,2,3)

    comprobador(tablero,ganador,0,4)
}

function agregarCirculo(veces){
    let posicion = Math.floor(Math.random() * 8)
    let casillas = document.getElementsByName("equis")
    
    if (casillas[posicion].getAttribute("value") == estado_final){
        veces += 1
        if (veces == 8){
            return
        }
        agregarO(veces)
        return
    }
    for (let casilla = 0; casilla < 9; casilla++){
        if (casillas[casilla].getAttribute("value") == estado_inicial && casillas[casilla].getAttribute("id") == posicion){
            casillas[casilla].innerText = CIRCULO
            casillas[casilla].setAttribute("value",estado_final)
        }
    }
}

function agregarCruz(id){
    let casilla = document.getElementById(`${id}`)
    let estado_casilla = casilla.getAttribute('value')


    if (estado_casilla !== estado_final) {
        casilla.innerText = CRUZ
        casilla.setAttribute("value", estado_final)

        agregarCirculo(0)
        comprobarGanador(CRUZ)
        comprobarGanador(CIRCULO)
    }
    

}


