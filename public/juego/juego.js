function agregarO(){
    let posicion = Math.floor(Math.random() * 8)
    let casillas = document.getElementsByName("equis")
    if (casillas[posicion].getAttribute("value") == "Cerrado"){
        agregarO()
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
    agregarO()
}
