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
    constructor(id, username, role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }
}

class RoomMessage {
    constructor (username, usernameColor, body) {
        this.username = username;
        this.usernameColor = usernameColor;
        this.body = body;
    }
}

class Room {
    constructor(name, creator, maxMembers, currentMembers = 0) {
        this.name = name;
        this.creator = creator;
        this.maxMembers = maxMembers;
        this.currentMembers = currentMembers;
        const d = new Date();
        const month = d.toLocaleString('default', { month: 'long' });
        this.creationDate = `${d.getDate()} ${month} ${d.getFullYear()}`;
        this.members = []
        this.messages = []
    }
}

class DBAccess {
    constructor() {
        this.usersDB = [];
        this.roomDB = [];
    }

    addUser(user) {
        if (!this.userExists(user.username)) {
            this.usersDB.push(user);
            return true;
        }
        return false;
    }

    removeUser(username) {
        this.userDB = this.usersDB.filter(u => u.username != username);
    }

    getUser(username) {
        for (let i = 0; i < this.usersDB.length; ++i) {
            if (this.usersDB[i].username == username) {
                return this.usersDB[i];
            }
        }
        return null
    }

    userExists(username) {
        for (let i = 0; i < this.usersDB.length; ++i) {
            if (this.usersDB[i].username == username) {
                return true;
            }
        }
        return false;
    }

    getAllUsers(username) {
        if (typeof (username) === undefined) {
            return this.userDB;
        }
        return this.userDB.filter(u => u.username == username);
    }

    addRoom(room) {
        if (!this.roomExists(room.name)) {
            this.roomDB.push(room);
            return true;
        }
        return false;
    }

    removeRoom(name) {
        this.roomDB = this.roomDB.filter(r => r.name != name);
    }

    getRoom(name) {
        for (let i = 0; i < this.roomDB.length; ++i) {
            if (this.roomDB[i].name == name) {
                return this.roomDB[i];
            }
        }
        return null;
    }

    roomExists(name) {
        for (let i = 0; i < this.roomDB.length; ++i) {
            if (this.roomDB[i].name == name) {
                return true;
            }
        }
        return false;
    }

    searchRooms(name) {
        if (name == undefined) {
            return this.roomDB;
        }
        return this.roomDB.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    }

    getUserRooms(username) {
        return this.roomDB.filter(r => r.creator == username);
    }
}

module.exports = {
    DBAccess: DBAccess,
    User: User,
    RoomMember: RoomMember,
    RoomMessage: RoomMessage,
    Room: Room
};