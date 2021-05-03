const socketio = require("socket.io");

class SocketListener {
    constructor(server, db) {
        this.io = socketio(server);
        this.db = db;
    }

    run() {
        this.io.on("connection", socket => {
            console.log("Client connected");
            socket.on("disconnect", () => {
                // remove user from room in db..
            })
        })
    }
}


module.exports = SocketListener;