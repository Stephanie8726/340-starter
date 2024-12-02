// WEEK 4 => show password toggle
document.addEventListener('DOMContentLoaded', function () {
  const passwordInput = document.getElementById('password');
  const showPassword = document.getElementById('show-password');

  showPassword.addEventListener('change', function () {
    if (this.checked) {
      passwordInput.type = 'text'; // show password
    } else {
      passwordInput.type = 'password'; // hide password
    }
  });
});