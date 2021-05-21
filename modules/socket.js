const socketio = require("socket.io");
const model = require("./model");
const utility = require("./utility");

class SocketListener {
    constructor(server, db) {
        this.io = socketio(server);
        this.db = db;
        this.canvasStates = {};
    }

    run() {
        const self = this;
        self.io.on("connection", socket => {
            let currentUser = {};

            socket.on("member-connect", connectData => {
                console.log(`User '${connectData.username}' joined room '${connectData.roomName}'`)
                socket.join(connectData.roomName);
                currentUser = connectData;
                socket.broadcast.to(currentUser.roomName).emit("insert-member", connectData);
                // update new user's canvas state

                if (self.canvasStates[currentUser.roomName]) {
                    socket.emit("canvas-set-state", self.canvasStates[currentUser.roomName]);
                }
            });

            socket.on("disconnect", () => {
                self.db.removeRoomMember(currentUser.roomName, currentUser.username, () => {
                    console.log(`User '${currentUser.username}' left room '${currentUser.roomName}'`)
                    socket.broadcast.to(currentUser.roomName).emit("member-disconnect", currentUser);
                })
            });

            socket.on("chat-message", message => {
                self.db.postRoomMessage(currentUser.roomName, new model.RoomMessage(currentUser.username, message.body),
                    () => {
                        const emitMessage = {
                            username: currentUser.username,
                            usernameColor: currentUser.usernameColor,
                            timestamp: message.timestamp,
                            body:  utility.sanitizeInput(message.body)
                        }
                        { self.io.to(currentUser.roomName).emit("message", emitMessage); }
                    });
            });

            socket.on("canvas-update", data => {
                socket.broadcast.to(currentUser.roomName).emit("canvas-update", data);
            })

            socket.on("canvas-get-state", state => {
                self.canvasStates[currentUser.roomName] = state;
            })
        })
    }
}

module.exports = SocketListener;