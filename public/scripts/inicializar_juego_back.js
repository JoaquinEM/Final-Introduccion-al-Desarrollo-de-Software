async function buscarJuego(idUsuario, nombreJuego) { //async function
    try {
        const response = await fetch(`/usuarios/${idUsuario}/juegos/${nombreJuego}`); //await
        if (!response.ok) {
            return null; // Retorna null si el juego no existe
        }
        const juego = await response.json(); //await
        return juego;
    } catch (error) {
        throw new Error(`Error al buscar el juego: ${error.message}`); //throw
    }
}

async function crearJuegoParaUsuario(idUsuario, nombreJuego) { //async function
    try {
        const response = await fetch(`/usuarios/${idUsuario}/juegos/${nombreJuego}`, {//await
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_usuario: idUsuario,
                nombre_juego: nombreJuego,
                partidas_ganadas: 0,
                partidas_perdidas: 0,
                partidas_empatadas: 0,
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al crear el juego para el usuario');//throw
        }
    } catch (error) {
        throw new Error(`Error al crear el juego para el usuario: ${error.message}`);//throw
    }
}

async function crearNuevaPartida() {//async
    const idUsuario = localStorage.getItem('idUsuario');
    const nombreJuego = document.getElementById('nombre-juego').textContent.trim();//textContent.trim()

    try {
        // Verificar si el juego existe para el usuario
        let juego = await buscarJuego(idUsuario, nombreJuego);//await

        if (!juego) {
            // Si el juego no existe, crearlo
            await crearJuegoParaUsuario(idUsuario, nombreJuego);//await
           
            // Volver a buscar el juego para obtener la información actualizada
            juego = await buscarJuego(idUsuario, nombreJuego);//await
        }
      
        // Crear nueva partida
        const nuevaPartidaResponse = await fetch(`/jugar/${idUsuario}`, {//await
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreJuego: nombreJuego })
        });

        if (!nuevaPartidaResponse.ok) {
            throw new Error('Error al crear la partida');//throw
        }

        const partida = await nuevaPartidaResponse.json();//await
        console.log('Partida creada:', partida);
    } catch (error) {
        console.log("LLEGUE AL ERROR")
        console.error('Error:', error.message);
        alert('Hubo un error al crear la partida.');
    }
}
