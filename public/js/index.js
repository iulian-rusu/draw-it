function validateLoginInputs(ev) {
    const password = document.getElementById("sign-in-password");
    const username = document.getElementById("sign-in-username");
    let isValid = true;

    if (!validateLength(password, 8, "password too short")) {
        isValid = false;
    }

    if (!validateLength(username, 2, "username too short")) {
        isValid = false;
    }

    if (!isValid) {
        ev.preventDefault();
        return false;
    }
    return false;
}

function validateRegisterInputs(ev) {
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("password-confirm");
    const firstName = document.getElementById("first-name");
    const lastName = document.getElementById("last-name");
    let isValid = true;

    if (!validateLength(firstName, 2, "first name too short")) {
        isValid = false;
    }

    if (!validateLength(lastName, 2, "last name too short")) {
        isValid = false;
    }

    if (!validateLength(username, 2, "username too short")) {
        isValid = false;
    }

    if (!validateLength(password, 8, "password too short")) {
        isValid = false;
    }

    if (password.value != passwordConfirm.value) {
        passwordConfirm.classList.add('error-placeholder-color');
        passwordConfirm.value = '';
        passwordConfirm.placeholder = "passwords don't match";
        isValid = false;
    }

    if (!isValid) {
        ev.preventDefault();
        return false;
    }
    return false;
}

function validateLength(element, minLength, errMsg) {
    if (element.value.length < minLength) {
        element.classList.add('error-placeholder-color');
        element.value = '';
        element.placeholder = errMsg;
        return false;
    }
    return true;
}

window.addEventListener("load", () => {
    const signInForm = document.getElementById("sign-in-form");
    signInForm.addEventListener("submit", (ev) => validateLoginInputs(ev));
    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", (ev) => validateRegisterInputs(ev));
});