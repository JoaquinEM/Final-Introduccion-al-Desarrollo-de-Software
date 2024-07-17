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
            // Aquí puedes redirigir a la página de juego, estadísticas,etc.
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
