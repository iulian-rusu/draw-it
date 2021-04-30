function setUsernameColor(value) {
    document.getElementById("username").style.color = value;
}

function saveDataLocally() {
    const color = document.getElementById("username-color").value;
    localStorage.setItem("username-color", color);
}

window.onload = () => {
    const color = document.getElementById("username-color").value;
    setUsernameColor(color);
}