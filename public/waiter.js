const submitSuccessMessage = document.querySelector("#submit-success-msg");

if (submitSuccessMessage.innerText !== "") {
    setTimeout(() => {
        submitSuccessMessage.classList.add("removeFadeOut")
        setTimeout(() => {
            submitSuccessMessage.innerText = ""
        }, 1000)
    }, 3000)
}