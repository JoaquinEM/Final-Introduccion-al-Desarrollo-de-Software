/*
Pre:
    1. Debe estar el documento HTML cargado.
    2. Debe existir`idUsuario` en `localStorage`.
    3. Debe existir el Endpoint `/estadisticas` que devuelve datos JSON.
    4. Debe existir la Función `calcularDiferenciaTiempo`.
    5. En el html debe haber un elemento con el id `estadistica`.
 
Post:
    1. Muestra estadísticas de juegos y partidas del usuario.
    2. Si no hay datos, muestra "No se encontraron estadísticas".
    3. Si hay error, muestra "Error al cargar las estadísticas".
    4. Si no hay `idUsuario`, muestra "Usuario no autenticado".
*/
document.addEventListener("DOMContentLoaded", function() {
    const idUsuario = localStorage.getItem('idUsuario'); // Asumiendo que el ID del usuario se almacena en el localStorage

    if (idUsuario) {
        fetch(`/estadisticas?id_usuario=${idUsuario}`)
            .then(response => response.json())
            .then(data => {
                if (data.juegos && data.partidas) {
                    let estadisticasHTML = '';

                    data.juegos.forEach(juego => {
                        if (juego.id_usuario == idUsuario) {
                            estadisticasHTML += `
                                <article id="estadisticas_globales">
                                    <h2>${juego.nombre_juego}</h2>
                                    <p>Partidas ganadas: ${juego.partidas_ganadas}</p>
                                    <p>Partidas perdidas: ${juego.partidas_perdidas}</p>
                                    <p>Partidas empatadas: ${juego.partidas_empatadas}</p>
                                </article>
                            `;
                        }
                    });

                    let num_partida = 1;

                    data.partidas.forEach(partida => {
                        if (partida.id_usuario == idUsuario && partida.estado_partida != "pendiente") {
                            console.log(partida.inicio_partida)
                            console.log(partida.final_partida)
                            
                            const tiempoJuego = calcularDiferenciaTiempo(partida.inicio_partida, partida.final_partida);


                            estadisticasHTML += `
                                <article id="partida">
                                    <p>${num_partida}</p>
                                    <p>${partida.estado_partida}</p>
                                    <p>${tiempoJuego}</p>
                                    
                                </article>
                            `;
                            num_partida++;
                        }
                    });

                    document.getElementById('estadistica').innerHTML = estadisticasHTML;
                } else {
                    document.getElementById('estadistica').innerText = 'No se encontraron estadísticas';
                }
            })
            .catch(error => {
                console.error('Error al obtener las estadísticas:', error);
                document.getElementById('estadistica').innerText = 'Error al cargar las estadísticas';
            });
    } else {
        document.getElementById('estadistica').innerText = 'Usuario no autenticado';
    }
});



/*
Pre:
    1. `inicio` y `final` deben ser variables de tipo `Date time`.

Post:
    1. Devuelve una cadena de texto en formato `mm:ss` que representa la diferencia de tiempo entre `inicio` y `final`.
    2. El formato será `minutos:segundos`, con minutos y segundos siempre mostrados con dos dígitos.
*/
function calcularDiferenciaTiempo(inicio, final) {
    const inicioFecha = new Date(inicio)
    const finalFecha = new Date(final)


    const diferenciaMs = finalFecha - inicioFecha;

    

    const minutos = Math.floor(diferenciaMs / 60000);
    const segundos = Math.floor((diferenciaMs % 60000) / 1000);

    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;

    return `${minutosFormateados}:${segundosFormateados}`;
}