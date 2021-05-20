/*
    utility.js - various utility functions
*/

const nameRegex = /^[A-Za-z ]+$/;
const usernameRegex = /^[_A-Za-z][_A-Za-z0-9]+$/;
const roomRegex = /^[^<>]+$/

function validateUsername(username) {
    return username && username.length >= 4 && username.length <= 30 && usernameRegex.test(username);
}

function validateName(name) {
    return name && name.length >= 2 && name.length <= 30 && nameRegex.test(name);
}

function validatePassword(password) {
    return password && password.length >= 4 && password.length <= 30;
}

function validateRoomName(roomName) {
    return roomName && roomName.length >= 2 && roomName.length <= 30 && roomRegex.test(roomName);
}

function sanitizeInput(input) {
    return input.split("\'").join("\\\'").split("<").join( "&lt;").split(">").join( "&gt;");
}

function desanitizeInput(input) {
    return input.split("\\\'").join("\'").split("&lt;").join( "<").split("&gt;").join( ">");
}

function desanitizeRooms(rooms) {
    for (let i = 0; i < rooms.length; ++i) {
        rooms[i] = utility.desanitizeInput(rooms[i]);
    }
}

module.exports = {
    validateUsername: validateUsername,
    validateName: validateName,
    validatePassword: validatePassword,
    validateRoomName: validateRoomName,
    sanitizeInput: sanitizeInput,
    desanitizeInput: desanitizeInput,
    desanitizeRooms: desanitizeRooms
}