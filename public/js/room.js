function joinRoom(name) {
    location.href = `/room?name=${name}`;
}

window.onbeforeunload = () => {
    const username = document.getElementById("username").innerHTML;
    // notify leave room
};