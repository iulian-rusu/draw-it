function setUsernameColor(value) {
    document.getElementById("username").style.color = value;
}

function saveDataLocally() {
    const username = document.getElementById("username").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const color = document.getElementById("username-color").value;

    localStorage[username] = {firstName: firstName, lastName: lastName, usernameColor: color};
}

window.onload = () => {
    const color = document.getElementById("username-color").value;
    setUsernameColor(color);
}