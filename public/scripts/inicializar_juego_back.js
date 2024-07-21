/*
Pre:
    1. `idUsuario` es de tipo int y `nombreJuego` es de tipo string.

Post:
    1. Realiza una solicitud para buscar un juego específico asociado con el `idUsuario` y el `nombreJuego`.
    2. Retorna el juego si la solicitud es exitosa y el juego existe.
    3. Retorna `null` si la solicitud es exitosa pero el juego no existe.
    4. Lanza un error si ocurre un problema al realizar la solicitud.

*/

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


/*
Pre:
    1. `idUsuario` es de tipo int y `nombreJuego` es de tipo string.

Post:
    1. Realiza una solicitud POST para crear un nuevo juego asociado con el `idUsuario` y `nombreJuego`.
    2. Si la solicitud es exitosa, el juego se crea con estadísticas iniciales (0 partidas: ganadas, perdidas y empatadas).
    3. Lanza un error si ocurre un problema al realizar la solicitud o si la respuesta no es exitosa.

*/

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


/*
Pres:
    1. La función `buscarJuego` debe estar disponible.
    2. La función `crearJuegoParaUsuario` debe estar disponible.
    3. El elemento con id `nombre-juego` debe estar en el DOM y contener el nombre del juego.

Post:
    1. Si el juego no existe, se crea un nuevo juego.
    2. Se crea una nueva partida para el juego especificado.

*/

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
        console.error('Error:', error.message);
        alert('Hubo un error al crear la partida.');
    }
}
