function comprobador(xRecta,ganador,arranque,suma){
    segundaPosicion = arranque + suma
    if (xRecta[arranque] == xRecta[arranque+suma] && xRecta[arranque+suma] == xRecta[segundaPosicion+suma] && xRecta[segundaPosicion+suma] == `${ganador}`){
        console.log(`GANÓ: ${ganador}`)
    }
}

function comprobarGanador(ganador){
    let xRecta = ["*","*","*","*","*","*","*","*","*"]
    casilla = document.getElementsByName("equis")
    for (let posicion = 0; posicion < 9; posicion++){
        if (casilla[posicion].innerText == "X"){
            xRecta[posicion] = "x"
        }
        if (casilla[posicion].innerText == "O"){
            xRecta[posicion] = "o"
        }
    }
    comprobador(xRecta,ganador,0,1)
    comprobador(xRecta,ganador,3,1)
    comprobador(xRecta,ganador,6,1)

    comprobador(xRecta,ganador,0,3)
    comprobador(xRecta,ganador,1,3)
    comprobador(xRecta,ganador,2,3)

    comprobador(xRecta,ganador,0,4)
}

function agregarO(veces){
    let posicion = Math.floor(Math.random() * 8)
    let casillas = document.getElementsByName("equis")
    if (casillas[posicion].getAttribute("value") == "Cerrado"){
        veces += 1
        if (veces == 8){
            return
        }
        agregarO(veces)
        return
    }
    for (let casilla = 0; casilla < 9; casilla++){
        if (casillas[casilla].getAttribute("value") == "Disponible" && casillas[casilla].getAttribute("id") == posicion){
            casillas[casilla].innerText = "O"
            casillas[casilla].setAttribute("value","Cerrado")
        }
    }
}

function agregarX(id){
    let casilla = document.getElementById(`${id}`)
    casilla.innerText = "X"
    casilla.setAttribute("value", "Cerrado")
    agregarO(0)
    comprobarGanador("x")
    comprobarGanador("o")
}
