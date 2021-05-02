function onKeyPress() {
    const key = window.event.keyCode;
    if (key == 13) {
        window.event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const username = document.getElementById("username").innerHTML;
    const roomName = document.getElementById("room-name").innerHTML;
    const usernameColor = document.getElementById("username-color").innerHTML;
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
    const messageBox = document.getElementById("chat-input-box");
    messageBox.value = '';
}

function insertMessageInChat(username, usernameColor, message) {
    const chat = document.getElementById("message-list");
    const date = new Date();
    const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    const newMessage = ` 
    <li>
        <div class="chat-message">
            <div class="chat-message-name" style="color: ${usernameColor}">
                ${username}
                <span class="chat-message-timestamp">
                    ${time}
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
    const chatDiv = document.getElementById("chat-messages");
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

window.addEventListener("load", () => {
    scrollChatDown();
    clearMessageBox();
});

window.onbeforeunload = () => {
    const username = document.getElementById("username").innerHTML;
    // notify leave room
};