document.getElementById('userForm').addEventListener('submit', function(event) {
    const password = document.getElementById('login-password').value;
    const passwordError = document.getElementById('passwordError');

    if (password.length < 8) {
        passwordError.style.display = 'block';
        event.preventDefault();
    } else {
        passwordError.style.display = 'none';
    }
});