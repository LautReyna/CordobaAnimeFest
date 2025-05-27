require('dotenv').config();

const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const usuario = process.env.LOGIN_USER;
const contra = process.env.LOGIN_PASS;
const redireccion = process.env.LOGIN_URL;

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.user.value;
    const password = loginForm.pass.value;

    if (username === usuario && password === contra) {
        alert("You have successfully logged in.");
        location.href= redireccion;
    } else {
        loginErrorMsg.style.opacity = 1;
    }
})