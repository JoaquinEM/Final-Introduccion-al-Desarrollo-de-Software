document.getElementById('login-form').addEventListener('submit', async function (e) { //async function
    e.preventDefault();
    const nombre = document.getElementById('login-username').value;
    const contraseña = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/usuarios', { //await
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña })
        });

        const data = await response.json(); //await
        const loginMessage = document.getElementById('login-message');
        
        if (response.status === 200) {
            // Aquí puedes redirigir a la página de juego, estadísticas,etc.
            localStorage.setItem('idUsuario', usuario.id_usuario); //localStorage
            console.log("Bienvenido")
            loginMessage.textContent = "Bienvenido";
            loginMessage.className = 'mensaje-exito';
        } else {
            loginMessage.textContent = data.message;
            loginMessage.className = 'mensaje-error';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const idUsuario = localStorage.getItem('idUsuario'); // Asumiendo que el ID del usuario se almacena en el localStorage
    console.log(idUsuario)
    if (idUsuario) {
        fetch(`/usuarios/${idUsuario}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.usuario_data.nombre_usuario)
                console.log(data.usuario_data.contraseña_usuario)
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                document.getElementsByClassName('Perfil').innerText = 'Error al cargar el usuario';
            });
    }
});