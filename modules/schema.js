/*
    schema.js - defines the database schema
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roomsJoined: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    messagesSent: {
        type: Number,
        required: true
    },
    usernameColor: {
        type: String,
        required: true
    },
});

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    creator: {
        type: String,
        required: true,
    },
    maxMembers: {
        type: Number,
        required: true,
    },
    creationDate: {
        type: String,
        required: true,
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        id: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true
        }
    }],
    messages: [{
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        body: {
            type: String,
            required: true,
        },
        timestamp: {
            type: String,
            required: true
        }
    }]
});

const User = mongoose.model("User", userSchema);
const Room = mongoose.model("Room", roomSchema);

const model = require("./model");

function createRoomModel(room) {
    const ans = new model.Room(room.name, room.creator, room.maxMembers);
    ans.members = room.members;
    ans.messages = room.messages;
    return ans;
}


module.exports = {
    User: User,
    Room: Room,
    createRoomModel: createRoomModel
};