document.addEventListener('DOMContentLoaded', function() {
    // Código existente

    // Selección de elementos en el formulario de registro
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordButton = document.getElementById('togglePassword');
    const toggleConfirmPasswordButton = document.getElementById('toggleConfirmPassword');

    // Toggle visibility for password
    togglePasswordButton.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Cambiar el ícono
        togglePasswordButton.innerHTML = type === 'password'
            ? '<i class="far fa-eye"></i>'
            : '<i class="far fa-eye-slash"></i>';
    });

    // Toggle visibility for confirm password
    toggleConfirmPasswordButton.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);

        // Cambiar el ícono
        toggleConfirmPasswordButton.innerHTML = type === 'password'
            ? '<i class="far fa-eye"></i>'
            : '<i class="far fa-eye-slash"></i>';
    });
});
