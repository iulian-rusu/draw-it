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
                console.log(`User '${connectData.username}' joined room '${connectData.roomName}'`)
                socket.join(connectData.roomName);
                currentUser = connectData;
                socket.broadcast.to(currentUser.roomName).emit("canvas-get-state");
                socket.broadcast.to(currentUser.roomName).emit("insert-member", connectData);
            });

            socket.on("disconnect", () => {
                self.db.removeRoomMember(currentUser.roomName, currentUser.username, () => {
                    console.log(`User '${currentUser.username}' left room '${currentUser.roomName}'`)
                    socket.broadcast.to(currentUser.roomName).emit("member-disconnect", currentUser);
                })
            });

            socket.on("chat-message", message => {
                self.db.postRoomMessage(message.roomName, new model.RoomMessage(message.username, message.body),
                    () => self.io.to(message.roomName).emit("message", message));
            });

            socket.on("canvas-update", data => {
                socket.broadcast.to(currentUser.roomName).emit("canvas-update", data);
            })

            socket.on("canvas-get-state", state => {
                socket.broadcast.to(currentUser.roomName).emit("canvas-set-state", state);
            })
        })
    }
}

module.exports = SocketListener;