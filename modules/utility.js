/*
    utility.js - various utility functions
*/

const nameRegex = /^[A-Za-z ]+$/;
const usernameRegex = /^[_A-Za-z][_A-Za-z0-9]+$/;

function validateUsername(username) {
    return username.length >= 4 && username.length <= 30 && usernameRegex.test(username);
}

function validateName(name) {
    return name.length >= 2 && name.length <= 30 && nameRegex.test(name);
}

function validatePassword(password) {
    return password.length >= 4 && password.length <= 30;
}

function sanitizeInput(input) {
    return input.replace("\'", "\\\'");
}

function desanitizeInput(input) {
    return input.replace("\\\'", "\'");
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
    sanitizeInput: sanitizeInput,
    desanitizeInput: desanitizeInput,
    desanitizeRooms: desanitizeRooms
}