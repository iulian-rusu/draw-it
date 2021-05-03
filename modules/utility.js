/*
    utility.js - various utility functions
*/

const nameRegex = /^[A-Za-z ]+$/;

function validateName(name) {
    return name.length >= 2 && nameRegex.test(name);
}

function validatePassword(password) {
    return password.length >= 4;
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
    validateName: validateName,
    validatePassword: validatePassword,
    sanitizeInput: sanitizeInput,
    desanitizeInput: desanitizeInput,
    desanitizeRooms: desanitizeRooms
}