const socketio = require("socket.io");
const model = require("./model");

class SocketListener {
    constructor(server, db) {
        this.io = socketio(server);
        this.db = db;
        this.canvasHistory = {};
    }

    run() {
        const self = this;
        self.io.on("connection", socket => {
            let currentUser = {};

            socket.on("member-connect", connectData => {
                socket.join(connectData.roomName);
                let roomCanvasHistory = self.canvasHistory[connectData.roomName];
                if (roomCanvasHistory == undefined) {
                    // room has no previous canvas history
                    roomCanvasHistory = [];
                } else {
                    // update new user's canvas
                    for (const event of roomCanvasHistory) {
                        socket.emit("canvas-update", event);
                    }
                }
                currentUser = connectData;
                socket.broadcast.to(connectData.roomName).emit("insert-member", connectData);
            });

            socket.on("disconnect", () => {
                self.db.removeRoomMember(currentUser.roomName, currentUser.username, () => {
                    socket.broadcast.emit("member-disconnect", currentUser);
                })
            });

            socket.on("chat-message", message => {
                self.db.postRoomMessage(message.roomName, new model.RoomMessage(message.username, message.body),
                    () => self.io.to(message.roomName).emit("message", message));
            });

            socket.on("canvas-update", data => {
                if (!self.canvasHistory[currentUser.roomName]) {
                    self.canvasHistory[currentUser.roomName] = [];
                }
                self.canvasHistory[currentUser.roomName].push(data);
                socket.broadcast.to(currentUser.roomName).emit("canvas-update", data);
            })
        })
    }
}

module.exports = SocketListener;