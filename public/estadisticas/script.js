// public/estadisticas/script.js
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


function calcularDiferenciaTiempo(inicio, final) {
    const inicioFecha = new Date(inicio);
    const finalFecha = new Date(final);

    const diferenciaMs = finalFecha - inicioFecha;
    const minutos = Math.floor(diferenciaMs / 60000);
    const segundos = ((diferenciaMs % 60000) / 1000).toFixed(0);

    const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;

    return `${minutosFormateados}:${segundosFormateados}`;
}