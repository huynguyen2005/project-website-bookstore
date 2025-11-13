const toggle = document.querySelector('.toggle-password');
const password = document.querySelector('input[name="password"]');

if (toggle && password) {
    toggle.addEventListener('click', () => {
        const type =
            password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        toggle.classList.toggle('bi-eye');
        toggle.classList.toggle('bi-eye-slash');
    });
}
