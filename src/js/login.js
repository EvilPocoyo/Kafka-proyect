document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const togglePasswordButton = document.getElementById('togglePassword');

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Cambiar el ícono
        togglePasswordButton.innerHTML = type === 'password'
            ? '<i class="far fa-eye"></i>'
            : '<i class="far fa-eye-slash"></i>';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const validEmail = 'example@gmail.com';
        const validPassword = 'example1234@';

        // Verificar credenciales
        if (emailInput.value.trim() === validEmail && passwordInput.value === validPassword) {
            // Credenciales correctas - redirigir a home.html
            window.location.href = 'home.html';
        } else {
            // Credenciales incorrectas - mostrar mensaje de error
            errorMessage.textContent = 'Email o contraseña incorrectos.';
            errorMessage.style.display = 'block';
            
            // Ocultar el mensaje de error después de 3 segundos
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 3000);
        }
    });
});