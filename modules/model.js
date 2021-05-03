/*
    model.js - defines the structure of user data, room data and messages for runtime use
*/

const moment = require('moment');

class User {
    constructor(username, firstName, lastName, password, roomsJoined = 0, messagesSent = 0, usernameColor = "#003264") {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.roomsJoined = [];
        this.messagesSent = messagesSent;
        this.usernameColor = usernameColor;
    }
}

class RoomMember {
    constructor(user, id, role) {
        this.user = user;
        this.id = id;
        this.role = role;
    }
}

class RoomMessage {
    constructor (author, body, timestamp = null) {
        this.author = author;
        this.body = body;
        this.timestamp = timestamp ?? moment().calendar().toLowerCase();
    }
}

class Room {
    constructor(name, creator, maxMembers) {
        this.name = name;
        this.creator = creator;
        this.maxMembers = maxMembers;
        this.members = []
        this.messages = []
        this.creationDate = moment().format('LLL');
    }

    get currentMembers() {
        return this.members.length;
    }
}

module.exports = {
    User: User,
    RoomMember: RoomMember,
    RoomMessage: RoomMessage,
    Room: Room
};