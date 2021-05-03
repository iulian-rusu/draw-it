const socketio = require("socket.io");
const model = require("./model");

class SocketListener {
    constructor(server, db) {
        this.io = socketio(server);
        this.db = db;
    }

    run() {
        const self = this;
        self.io.on("connection", socket => {
            let currentUser = {};

            socket.on("member-connect", connectData => {
                socket.join(connectData.roomName);
                currentUser = connectData;
                socket.broadcast.to(connectData.roomName).emit("insert-member", {
                    username: connectData.username,
                    role: connectData.role,
                    id: connectData.id
                });
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
        })
    }
}

module.exports = SocketListener;