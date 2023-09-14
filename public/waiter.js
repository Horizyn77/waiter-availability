const userError = document.querySelector("#userError");
const passwordError = document.querySelector("#passwordError");

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