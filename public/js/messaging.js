// setup socket.io
const socket = io();
socket.on("message", () => {
    console.log(message);
});

// DOM manipulation
const chat = document.getElementById("message-list");
const messageBox = document.getElementById("chat-input-box");
const chatDiv = document.getElementById("chat-messages");
const username = document.getElementById("username").innerHTML;
const roomName = document.getElementById("room-name").innerHTML;
const usernameColor = document.getElementById("username-color").innerHTML;

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
            insertMessageInChat(username, usernameColor, message);
        }
    };

    xhttp.open("POST", `/post-message`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    const messageData = {
        username: username,
        body: message,
        roomName: roomName
    }
    xhttp.send(JSON.stringify(messageData));

    clearMessageBox();
}

function clearMessageBox() {
    messageBox.value = '';
}

function insertMessageInChat(username, usernameColor, message) {
    const newMessage = ` 
    <li>
        <div class="chat-message">
            <div class="chat-message-name" style="color: ${usernameColor}">
                ${username}
                <span class="chat-message-timestamp">
                    ${moment().calendar().toLowerCase()}
                </span>
            </div>
            <div class="chat-message-body">
                <p>
                    ${message}
                </p>
            </div>
        </div>
    </li>`;
    chat.innerHTML += newMessage;
    scrollChatDown();
}

function scrollChatDown() {
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

window.addEventListener("load", () => {
    scrollChatDown();
    clearMessageBox();
});

window.onbeforeunload = () => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `/leave-room`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    const data = {
        roomName: roomName,
        username: username
    };

    xhttp.send(JSON.stringify(data));
};