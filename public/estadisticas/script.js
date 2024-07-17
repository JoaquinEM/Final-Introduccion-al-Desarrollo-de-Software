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
                                <h2>${juego.nombre_juego}</h2>
                                <p>Partidas ganadas: ${juego.partidas_ganadas}</p>
                                <p>Partidas perdidas: ${juego.partidas_perdidas}</p>
                                <p>Partidas empatadas: ${juego.partidas_empatadas}</p>
                            `;
                        }
                    });

                    data.partidas.forEach(partida => {
                        if (partida.id_usuario == idUsuario) {
                            estadisticasHTML += `
                                <h3>Partida ID: ${partida.id}</h3>
                                <p>Estado de la partida: ${partida.estado_partida}</p>
                                <p>Inicio de la partida: ${partida.inicio_partida}</p>
                                <p>Final de la partida: ${partida.final_partida}</p>
                            `;
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
