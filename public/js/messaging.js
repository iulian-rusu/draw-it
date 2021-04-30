function onKeyPress() {
    const key = window.event.keyCode;
    if (key == 13) {
        window.event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById("chat-input-box");
    const message = input.value;
    if (message.length === 0) {
        return;
    }

    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            insertMessageInChat("admin", message);
        }
    };
    xhttp.open("POST", `/send-message`, true);
    xhttp.send(`message=${message}`);

    clearMessageBox();
}

function clearMessageBox() {
    const messageBox = document.getElementById("chat-input-box");
    messageBox.value = '';
}

function insertMessageInChat(username, message) {
    const usernameColor = localStorage.getItem("username-color");
    const chat = document.getElementById("message-list");
    const newMessage = `            
    <li>
        <div class="chat-message">
            <div class="chat-message-name" style="color: ${usernameColor}">
                <p>${username}</p>
            </div>
            <div class="chat-message-body">
                <p>${message}</p>
            </div>
        </div>
    </li>`;
    chat.innerHTML += newMessage;
    scrollChatDown();
}

function scrollChatDown() {
    const chatDiv = document.getElementById("chat-messages");
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

window.addEventListener("load", () => {
    scrollChatDown();
    clearMessageBox();
});