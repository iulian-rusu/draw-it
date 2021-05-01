const { RoomMember } = require("./model");
const model = require("./model");

module.exports = {
    index: (req, res) => {
        const user = req.session.user;
        if (user) {
            res.redirect("/home");
            return;
        }
        res.render('index', {
            loadMenuBar: false,
            pageTitle: "Welcome to Draw It!",
            styleList: ["index-style.css"],
            currentPageLink: "index",
            containerId: "front-page-container",
        });
    },
    logout: (req, res) => {
        req.session.user = null;
        res.redirect("/");
    },
    home: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            res.redirect("/");
            return;
        }
        res.render('home', {
            loadMenuBar: true,
            pageTitle: "Home",
            styleList: ["tables.css", "home-style.css"],
            currentPageLink: "home",
            containerId: "home-page-container",
            rooms: db.searchRooms()
        });
    },
    account: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            res.redirect("/");
            return;
        }
        res.render('account', {
            loadMenuBar: true,
            pageTitle: "Account",
            styleList: ["tables.css", "account-style.css"],
            currentPageLink: "account",
            containerId: "account-page-container",
            user: user,
            userRooms: db.getUserRooms(user.username)
        });
    },
    room: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            res.redirect("/");
            return;
        }

        const roomName = req.query["name"];
        if (!roomName) {
            res.redirect("/");
            return;
        }

        const room = db.getRoom(roomName);
        let role = "guest";
        let id = "guest-" + room.members.length + 1;
        if (room.creator == user.username) {
            role = "creator";
            id = "creator";
        }
        
        room.members.push(new RoomMember(id, user.username, role));
        res.render('room', {
            loadMenuBar: true,
            pageTitle: "Room",
            styleList: ["tables.css", "room-style.css"],
            currentPageLink: "room",
            containerId: "room-page-container",
            room: room,
            session: req.session
        });
    },
    logIn: (db) => (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const user = db.getUser(username);

        if (user === null) {
            res.redirect("/");
            return;
        }

        if (user.password != password) {
            res.redirect("/");
            return;
        }
        // remember user details in session
        req.session.user = user;

        res.redirect("/home");
    },
    register: (db) => (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const passwordConfirm = req.body["password-confirm"];
        const firstName = req.body["first-name"];
        const lastName = req.body["last-name"];

        if (password != passwordConfirm) {
            res.redirect("/");
            return;
        }

        if (db.userExists(username)) {
            res.redirect("/");
            return;
        }

        const newUser = new model.User(username, firstName, lastName, password);
        db.addUser(newUser);
        // remember user details in session
        req.session.user = newUser;

        res.redirect("/home");
    },
    searchRoom: (db) => (req, res) => {
        const username = req.session.username;
        if (!username) {
            res.redirect("/");
            return;
        }
        const roomName = req.query["name"].toLowerCase();
        if (roomName.length === 0) {
            res.redirect("/home");
            return;
        }

        res.render('home', {
            loadMenuBar: true,
            pageTitle: "Home",
            styleList: ["tables.css", "home-style.css"],
            currentPageLink: "home",
            containerId: "home-page-container",
            rooms: db.searchRooms(roomName)
        });
    },
    createRoom: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            res.redirect("/");
            return;
        }
        const roomName = req.body["name"];
        let maxMembers = req.body["max-members"];
        if (parseInt(maxMembers) > 10) {
            maxMembers = "10";
        }
        const author = user.username;
        const newRoom = new model.Room(roomName, author, maxMembers);
        db.addRoom(newRoom);

        res.redirect("/home");
    },
    editAccount: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            res.redirect("/");
            return;
        }
        let currentUser = db.getUser(user.username);
        currentUser.firstName = req.body["first-name"];
        currentUser.lastName = req.body["last-name"];
        currentUser.usernameColor = req.body["username-color"];
        req.session.user = currentUser;
        res.redirect("/account");
    }
};