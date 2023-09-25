const userError = document.querySelector("#userError");
const passwordError = document.querySelector("#passwordError");
const closeModalBtn = document.querySelector("#close-modal-btn");
const loginDetailsModal = document.querySelector(".login-details-modal");
const demoLoginDetailsBtn = document.querySelector("#demo-login-btn")
const loginDetailsOverlay = document.querySelector(".login-details-overlay")
const loginForm = document.querySelector("#login-form");
const signUpForm = document.querySelector("#sign-up-form");
const loginBtn = document.querySelector("#login-btn");
const signUpBtn = document.querySelector("#sign-up-btn");


userError.style.display = "block";
passwordError.style.display = "block";

if (userError.innerText !== "" || passwordError.innerText !== "") {
    setTimeout(() => {
        userError.classList.add("removeFadeOut")
        passwordError.classList.add("removeFadeOut")
        setTimeout(() => {
            userError.style.display = "none";
            passwordError.style.display = "none";
        }, 800)
    }, 3000)
}

demoLoginDetailsBtn.addEventListener("click", () => {
    loginDetailsOverlay.classList.remove("hide-modal");
    loginDetailsModal.classList.remove("hide-modal");
})

closeModalBtn.addEventListener("click", () => {
    loginDetailsOverlay.classList.add("hide-modal");
    loginDetailsModal.classList.add("hide-modal")
})

loginDetailsOverlay.addEventListener("click", () => {
    loginDetailsOverlay.classList.add("hide-modal");
    loginDetailsModal.classList.add("hide-modal")
})
