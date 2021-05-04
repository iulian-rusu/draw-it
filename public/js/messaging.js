// DOM manipulation
const chat = document.getElementById("message-list");
const messageBox = document.getElementById("chat-input-box");
const chatDiv = document.getElementById("chat-messages");
const roomMembers = document.getElementById("room-members-tbody");
// data about current user
const username = document.getElementById("username").innerHTML;
const usernameColor = document.getElementById("username-color").innerHTML;
const id = document.getElementById("id").innerHTML;
const role = document.getElementById("role").innerHTML;
const roomName = document.getElementById("room-name").innerHTML;

// setup socket.io
const socket = io();
socket.emit("member-connect", { username: username, id: id, role: role, roomName: roomName, usernameColor: usernameColor });
socket.on("member-disconnect", data => {
    removeMemberFromRoom(data);
    insertSystemMessageInChat(data.username, data.usernameColor, "has left the room");
});
socket.on("insert-member", member => {
    insertMemberInRoom(member);
    insertSystemMessageInChat(member.username, member.usernameColor, "has joined the room");
});
socket.on("message", message => insertMessageInChat(message));


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

    const messageData = {
        roomName: roomName,
        username: username,
        usernameColor: usernameColor,
        timestamp: moment().calendar().toLowerCase(),
        body: message
    }

    console.log(messageData);
    socket.emit("chat-message", messageData);
    clearMessageBox();
}

function clearMessageBox() {
    messageBox.value = '';
}

function insertMessageInChat(message) {
    const newMessage = ` 
    <li>
        <div class="chat-message">
            <div class="chat-message-name" style="color: ${message.usernameColor}">
                ${message.username}
                <span class="chat-message-timestamp">
                    ${message.timestamp}
                </span>
            </div>
            <div class="chat-message-body">
                <p>
                    ${message.body}
                </p>
            </div>
        </div>
    </li>`;
    chat.innerHTML += newMessage;
    scrollChatDown();
}

function insertSystemMessageInChat(name, color, action) {
    const newSysMessage = `               
    <li class="system-message">
        <p><span style="color: ${color}">${name}</span> ${action}</p>
    </li>`;
    chat.innerHTML += newSysMessage;
    scrollChatDown();
}

function insertMemberInRoom(member) {
    const newMember = `
    <tr id="${member.id}" > 
        <td>
            ${member.username}
        </td>
        <td>
            ${member.role}
        </td>
    </tr>`;
    roomMembers.innerHTML += newMember;
}

function removeMemberFromRoom(data) {
    const members = roomMembers.childNodes;
    for (const member of members) {
        if (member.id == data.id) {
            roomMembers.removeChild(member);
        }
    }
}

function scrollChatDown() {
    chatDiv.scrollTop = chatDiv.scrollHeight;
}

window.addEventListener("load", () => {
    const members = roomMembers.childNodes;
    let exists = false;
    for (const member of members) {
        if (member.id == id) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        insertMemberInRoom({ id: id, username: username, role: role });
    }
});

window.addEventListener("load", () => {
    scrollChatDown();
    clearMessageBox();
});