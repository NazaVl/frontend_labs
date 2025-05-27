document.getElementById('registerForm').addEventListener('submit', function(event) {
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    const passwordError = document.getElementById('passwordError');
    const matchError = document.getElementById('matchError');

    let isValid = true;

    if (password.length < 8) {
        passwordError.style.display = 'block';
        isValid = false;
    } else {
        passwordError.style.display = 'none';
    }

    if (password !== confirmPassword) {
        matchError.style.display = 'block';
        isValid = false;
    } else {
        matchError.style.display = 'none';
    }

    if (!isValid) {
        event.preventDefault();
    }
});