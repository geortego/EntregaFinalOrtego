document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('confirm-password').addEventListener('input', function () {
        const password = document.getElementById('new-password').value;
        const confirm = this.value;

        if (password !== confirm) {
            this.setCustomValidity('Las contraseñas no coinciden');
        } else {
            this.setCustomValidity('');
        }
    });

    document.querySelector('.registro-section form').addEventListener('submit', function (event) {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        const usuario = {
            nombre,
            apellido,
            email,
            username,
            password,
        };

        let usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuariosRegistrados.push(usuario);
        localStorage.setItem('usuarios', JSON.stringify(usuariosRegistrados));

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');

        event.target.reset();
    });

    document.getElementById('cotizador-button').addEventListener('click', function () {
        const username = document.getElementById('username').value;

        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuarios')) || [];

        const usuario = usuariosRegistrados.find(user => user.username === username);

        if (usuario) {
            localStorage.setItem('nombre', usuario.nombre);
            localStorage.setItem('apellido', usuario.apellido);
            localStorage.setItem('email', usuario.email);

            window.location.href = 'solicitar.html';
        } else {
            alert('Usuario no encontrado. Por favor, verifica tus credenciales o regístrate.');
        }
    });
});