document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const nombre = document.getElementById('login-username').value;
    const contraseña = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña })
        });

        const data = await response.json();
        
        if (response.status === 200) {
            // Aquí puedes redirigir a la página de juego, estadísticas,etc.
            localStorage.setItem('idUsuario', data.idUsuario);
            console.log("Bienvenido")
            window.location.href = './juego/index.html';
        } else {
            document.getElementById('login-message').textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

document.getElementById('signup-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const nombre = document.getElementById('signup-username').value;
    const contraseña = document.getElementById('signup-password').value;
    
    try {
        const response = await fetch('/usuarios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, contraseña })
        });

        const data = await response.json();
        
        if (response.status === 201) {
            document.getElementById('signup-message').textContent = 'Usuario creado correctamente.';
        } else {
            document.getElementById('signup-message').textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
