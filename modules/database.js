/*
    database.js - provides an interface for accessing the database
*/

// URI for connecting to cloud database
const dbURI = process.env.DB_URI
const schema = require("./schema");
const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

class MongoDB {
    constructor(callback) {
        mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log("Connected to cluster.");
                callback();
            })
            .catch((err) => console.log(err));
    }

    addUser(user, callback) {
        const convertedUser = schema.User({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            password: user.password,
            roomsJoined: user.roomsJoined,
            messagesSent: user.messagesSent,
            usernameColor: user.usernameColor
        });
        convertedUser.save().then(callback).catch(err => console.log(err));
    }

    getUser(username, callback) {
        schema.User.findOne({ username: username }).then(callback).catch(err => console.log(err));
    }

    updateUser(username, userData, callback) {
        this.getUser(username, user => {
            if (!user) {
                return;
            }
            user.firstName = userData.firstName;
            user.lastName = userData.lastName;
            user.usernameColor = userData.usernameColor;
            user.save().then(callback).catch(err => console.log(err));
        });
    }

    removeUser(username, callback) {
        schema.User.deleteOne({ username: username }).then(callback).catch(err => console.log(err));
    }

    userExists(username, callback) {
        schema.User.exists({ username: username }).then(callback).catch(err => console.log(err));
    }

    getAllUsers(callback) {
        schema.User.find().then(callback).catch(err => console.log(err));
    }

    addRoom(room, callback) {
        const convertedRoom = new schema.Room({
            name: room.name,
            creator: room.creator,
            maxMembers: room.maxMembers,
            creationDate: room.creationDate,
            members: [],
            messages: []
        });
        convertedRoom.save().then(callback).catch(err => console.log(err));
    }

    postRoomMessage(name, message, callback) {
        const self = this;
        self.getRoom(name, room => {
            if (!room) {
                return;
            }
            self.getUser(message.author, author => {
                if (!author) {
                    return;
                }
                room.messages.push({
                    author: author._id,
                    body:message.body,
                    timestamp: message.timestamp
                });
                ++author.messagesSent;
                author.save();
                room.save().then(callback).catch(err => console.log(err));
            });
        });
    }

    addRoomMember(name, username, callback) {
        const self = this;
        self.getRoom(name, room => {
            if (!room) {
                callback("Room doesn't exist");
                return;
            }
            self.getUser(username, user => {
                if (!user) {
                    callback("User doesn't exist");
                    return;
                }

                let exists = false;
                for (let i = 0; i < room.members.length; ++i) {
                    if (room.members[i].user.equals(user._id)) {
                        exists = true;
                        break;
                    }
                }

                if (room.members.length >= room.maxMembers && !exists) {
                    callback("Room full");
                    return;
                }

                let role = "guest";
                let id = "guest-" + room.members.length + 1;
                if (room.creator == user.username) {
                    role = "creator";
                    id = "creator";
                }
                if (user.roomsJoined.indexOf(room._id) == -1) {
                    user.roomsJoined.push(room._id);
                    user.save();
                }
                const roomMember = { user: user._id, id: id, role: role };
                if (!exists) {
                    room.members.push(roomMember);
                }
                room.save().then(() => callback(null, roomMember)).catch(err => console.log(err));
            });
        });
    }

    removeRoomMember(name, username, callback) {
        const self = this;
        self.getRoom(name, room => {
            if (!room) {
                return;
            }
            self.getUser(username, user => {
                if (!user) {
                    return;
                }
                room.members = room.members.filter(m => !m.user.equals(user._id));
                room.save().then(callback).catch(err => console.log(err));
            });
        });
    }

    getPopulatedRoom(name, callback) {
        schema.Room.findOne({ name: name })
            .populate("members.user")
            .populate("messages.author")
            .then(callback).catch(err => console.log(err));
    }

    getRoom(name, callback) {
        schema.Room.findOne({ name: name }).then(callback).catch(err => console.log(err));
    }

    removeRoom(name, callback) {
        schema.Room.deleteOne({ name: name }).then(callback).catch(err => console.log(err));
    }

    roomExists(name, callback) {
        schema.Room.exists({ name: name }).then(callback).catch(err => console.log(err));
    }

    searchRooms(name, callback) {
        if (!name) {
            schema.Room.find().then(callback).catch(err => console.log(err));
        } else {
            const nameRegex = new RegExp(name, 'i')
            schema.Room.find({ name: nameRegex }).then(callback).catch(err => console.log(err));
        }
    }

    getUserRooms(username, callback) {
        schema.Room.find({ creator: username }).then(callback).catch(err => console.log(err));
    }
}

module.exports = MongoDB;
