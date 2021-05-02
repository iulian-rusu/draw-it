/*
    database.js - provides an interface for accessing the database
*/

class DBAccess {
    constructor() {
        this.userDB = [];
        this.roomDB = [];
    }

    addUser(user) {
        if (!this.userExists(user.username)) {
            this.userDB.push(user);
            return true;
        }
        return false;
    }

    removeUser(username) {
        this.userDB = this.userDB.filter(u => u.username != username);
    }

    getUser(username) {
        for (let i = 0; i < this.userDB.length; ++i) {
            if (this.userDB[i].username == username) {
                return this.userDB[i];
            }
        }
        return null
    }

    userExists(username) {
        for (let i = 0; i < this.userDB.length; ++i) {
            if (this.userDB[i].username == username) {
                return true;
            }
        }
        return false;
    }

    getAllUsers(username) {
        if (!username) {
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
        console.log(name);
        console.log(this.roomDB);
        this.roomDB = this.roomDB.filter(r => r.name != name);
        console.log(this.roomDB);
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
    DBAccess: DBAccess
}