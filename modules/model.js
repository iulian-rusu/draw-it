/*
    model.js - defines the structure of user data, room data, messages etc.
*/

const moment = require('moment');

class User {
    constructor(username, firstName, lastName, password, roomsJoined = 0, messagesSent = 0, usernameColor = "#003264") {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.roomsJoined = roomsJoined;
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
    constructor (user, body) {
        this.user = user;
        this.body = body;
        this.timestamp = moment().format("HH:mm:ss");
    }
}

class Room {
    constructor(name, creator, maxMembers) {
        this.name = name;
        this.creator = creator;
        this.maxMembers = maxMembers;
        this.members = []
        this.messages = []
        const d = new Date();
        const month = d.toLocaleString('default', { month: 'long' });
        this.creationDate = `${d.getDate()} ${month} ${d.getFullYear()}`;
    }

    get currentMembers() {
        return this.members.length;
    }

    contains(username) {
        for (let i = 0; i < this.members.length; ++i) {
            if (this.members[i].user.username == username) {
                return true;
            }
        }
        return false;
    }

    addMember(user) {
        if(this.contains(user.username)) {
            return;
        }
        let role = "guest";
        let id = "guest-" + this.currentMembers + 1;
        if (this.creator == user.username) {
            role = "creator";
            id = "creator";
        }
        const newMember = new RoomMember(user, id, role);
        this.members.push(newMember);
    }
}

module.exports = {
    User: User,
    RoomMember: RoomMember,
    RoomMessage: RoomMessage,
    Room: Room
};