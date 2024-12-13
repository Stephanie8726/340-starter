// WEEK 4 => show password toggle
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("password");
  const showPassword = document.getElementById("show-password");

  showPassword.addEventListener("change", function () {
    if (this.checked) {
      passwordInput.type = "text"; // show password
    } else {
      passwordInput.type = "password"; // hide password
    }
  });
});

// Code for the hamburger menu
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector(".nav-header");

menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");

  if (menuButton.textContent === "☰") {
    menuButton.textContent = "❌";
  } else {
    menuButton.textContent = "☰";
  }
});
