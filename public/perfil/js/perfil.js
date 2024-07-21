
/*
Pre:
    1. Los elementos del formulario deben existir en el HTML.
    2. `idUsuario` debe estar almacenado en el `localStorage`.

Post:
    1. Envía una solicitud al servidor con la contraseña.
    2. Muestra un mensaje de éxito si la solicitud es exitosa y recarga la página cambiando la contaceña.
    3. Muestra un mensaje de error si la solicitud falla.

*/

document.getElementById('login-form').addEventListener('submit', async function (e) { //async function
    e.preventDefault();
    const idUsuario = localStorage.getItem('idUsuario'); 
    const contraseña = document.getElementById('login-password').value;
    
    if (!idUsuario) {
        alert("No se ha encontrado el ID del usuario.");
        return;
    }

    try {
        const response = await fetch(`/usuarios/${idUsuario}`, { //await
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contraseña })
        });

        const data = await response.json(); //await
        const loginMessage = document.getElementById('login-message');
        
        if (response.status === 200) {
            // Aquí puedes redirigir a la página de juego, estadísticas,etc.
            localStorage.setItem('idUsuario', idUsuario); //localStorage
            console.log("Bienvenido")
            loginMessage.textContent = "Bienvenido";
            loginMessage.className = 'mensaje-exito';
            location.reload()
        } else {
            loginMessage.textContent = data.message;
            loginMessage.className = 'mensaje-error';
        }
    } catch (error) {
        console.error('Error:', error);
    }
    window.location.href = window.location.href;
});



/*
Pre:
    1. El `idUsuario` debe estar almacenado en el `localStorage`.
    2. El elemento con ID `info` debe existir en el HTML.

Post:
    1. Si el `idUsuario` está disponible, realiza una solicitud para obtener datos del usuario.
    2. Muestra el nombre y la contraseña del usuario en una lista dentro del elemento con ID `info`.
    3. Muestra un mensaje de error si la solicitud falla o no se puede cargar el usuario.


*/

document.addEventListener("DOMContentLoaded", function() {
    const idUsuario = localStorage.getItem('idUsuario'); // Asumiendo que el ID del usuario se almacena en el localStorage
    //console.log(idUsuario)
    if (idUsuario) {
        fetch(`/usuarios/${idUsuario}`)
            .then(response => response.json())
            .then(data => {

                let nombre = document.createElement("li")
                let contraseña = document.createElement("li")

                nombre.append(`Nombre:      ${data.usuario_data.nombre_usuario}`)
                contraseña.append(`Contraseña:      ${data.usuario_data.contraseña_usuario}`)

                let lista_datos = document.getElementById("info")
                lista_datos.append(nombre,contraseña)
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                document.getElementsByClassName('Perfil').innerText = 'Error al cargar el usuario';
            });
    }
});


/*
Pre
    1. El `idUsuario` debe estar almacenado en el `localStorage`.
    2. El usuario debe confirmar la eliminación mediante un cuadro de diálogo.

Post:
    1. Si el usuario confirma y el `idUsuario` está disponible, se realiza una solicitud DELETE para eliminar el usuario y todos sus datos relacionados.
    2. Si la eliminación es exitosa, se muestra un mensaje de éxito, se elimina el `idUsuario` del `localStorage`, y se redirige al usuario a la página principal.
    3. Si la eliminación falla, se muestra un mensaje de error.

*/
function borrarCuenta(){
    if(!confirm("¿Seguro de eliminar tu usuario?")){return}
    const idUsuario = localStorage.getItem('idUsuario')
    if (idUsuario){
        fetch(`/usuarios/${idUsuario}`, {method : "DELETE"})
            .then(response => response.json())
            .then(data => {
                if (data.mensaje == 'El usuario se ha eliminado'){
                    alert("Tu usuario fue eliminado")
                    localStorage.removeItem('idUsuario')
                    window.location.href = "../index.html"
                }else{alert("No fue posible eliminar el usuario")}
                
            })
            .catch(error => {console.error('Error al eliminar el usuario:', error);});
    }
}