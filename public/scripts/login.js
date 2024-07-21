
/*
Pre:
    1. Debe haber un endpoint en el backend para manejar las solicitudes de inicio de sesión.


Post:
    1. Si el inicio de sesión del usuario es exitoso, se almacena el ID de usuario en el localStorage y se redirige al usuario a la página de juego.
    2. Si hay un error en el inicio de sesión, se muestra un mensaje de error.

*/

document.getElementById('login-form').addEventListener('submit', async function (e) { //async function
    e.preventDefault();
    
    const nombre = document.getElementById('login-username').value;
    const contraseña = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/login', { //await
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña })
        });

        const data = await response.json(); //await
        const loginMessage = document.getElementById('login-message');
        
        if (response.status === 200) {
            localStorage.setItem('idUsuario', data.idUsuario); //localStorage
            console.log("Bienvenido")
            loginMessage.textContent = "Bienvenido";
            loginMessage.className = 'mensaje-exito';
            window.location.href = './juego/index.html';
        } else {
            loginMessage.textContent = data.message;
            loginMessage.className = 'mensaje-error';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


/*
Pre:
    1. Debe haber un endpoint disponible para procesar el registro del usuario en el backend.


Post:
    1. Si el registro del usuario es exitoso, se muestra un mensaje de éxito en la página y se redirige la informacion a la bd.
    2. Si hay un error en el registro, se muestra un mensaje de error en la página.

*/

document.getElementById('signup-form').addEventListener('submit', async function (e) { //async function
    e.preventDefault();
    
    const nombre = document.getElementById('signup-username').value;
    const contraseña = document.getElementById('signup-password').value;

    
    try {
        const response = await fetch('/usuarios', { //await
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña })
        });

        const data = await response.json(); //await
        const signupMessage = document.getElementById('signup-message');
        
        if (response.status === 201) {
            signupMessage.textContent = 'Usuario creado correctamente.';
            signupMessage.className = 'mensaje-exito';
        } else {
            signupMessage.textContent = data.message; //textContent o InnerText?
            signupMessage.className = 'mensaje-error';  
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
