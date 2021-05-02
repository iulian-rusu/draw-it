/*
    routes.js - contains the controller logic for all application routes
*/

const { RoomMessage } = require("./model");
const model = require("./model");
const utility = require("./utility");
const crypto = require("bcrypt");
const saltRounds = 10;
let errors = [];

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
            errors: errors
        });
        errors = [];
    },
    logout: (req, res) => {
        req.session.user = null;
        res.redirect("/");
    },
    home: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
            res.redirect("/");
            return;
        }

        res.render('home', {
            loadMenuBar: true,
            pageTitle: "Home",
            styleList: ["tables.css", "home-style.css"],
            currentPageLink: "home",
            containerId: "home-page-container",
            rooms: db.searchRooms(),
            utility: utility,
            errors: errors
        });
        errors = [];
    },
    account: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
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
            userRooms: db.getUserRooms(user.username),
            utility: utility,
            errors: errors
        });
        errors = [];
    },
    room: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
            res.redirect("/");
            return;
        }

        const roomName = req.query["name"];
        if (!roomName) {
            errors = ["Invalid room"];
            res.redirect("/");
            return;
        }

        const room = db.getRoom(roomName);
        if(!room) {
            errors = ["Invalid room"];
            res.redirect("/home");
            return;
        }

        room.addMember(user);
        res.render('room', {
            loadMenuBar: true,
            pageTitle: "Room",
            styleList: ["tables.css", "room-style.css"],
            currentPageLink: "room",
            containerId: "room-page-container",
            room: room,
            session: req.session,
            errors: errors
        });
        errors = [];
    },
    logIn: (db) => async (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const user = db.getUser(username);

        if (user === null) {
            errors = ["You must be logged in"];
            res.redirect("/");
            return;
        }

        const isSamePassword = await crypto.compare(password, user.password);
        if (!isSamePassword) {
            errors = ["Failed to log in"];
            res.redirect("/");
            return;
        }
        // remember user details in session
        req.session.user = user;

        res.redirect("/home");
    },
    register: (db) => async (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const passwordConfirm = req.body["password-confirm"];
        const firstName = req.body["first-name"];
        const lastName = req.body["last-name"];

        if (!(utility.validateName(firstName) && utility.validateName(lastName) && utility.validatePassword(password))) {
            errors = ["Please enter valid values"];
            res.redirect("/");
            return;
        }

        if (password != passwordConfirm) {
            errors = ["Passwords don't match"];
            res.redirect("/");
            return;
        }

        const hashedPassword = await crypto.hash(password, saltRounds);

        if (db.userExists(username)) {
            errors = [`Username '${username}' is already taken`];
            res.redirect("/");
            return;
        }

        const newUser = new model.User(username, firstName, lastName, hashedPassword);
        db.addUser(newUser);
        // remember user details in session
        req.session.user = newUser;

        res.redirect("/home");
    },
    searchRoom: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
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
            rooms: db.searchRooms(roomName),
            utility: utility,
            errors: errors
        });
        errors = [];
    },
    postMessage: (db) => (req, res) => {
        const msgBody = req.body["body"];
        const roomName = req.body["roomName"];
        const username = req.body["username"];

        if (roomName && msgBody && username) {
            const room = db.getRoom(roomName);
            const user = db.getUser(username);
            if (room && user) {
                room.messages.push(new RoomMessage(user, msgBody));
                res.sendStatus(200);
                return;
            }
        }
        console.log(roomName);
        console.log(msgBody);
        console.log(username);
        res.sendStatus(400);
    },
    createRoom: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
            res.redirect("/");
            return;
        }
        const roomName = req.body["name"];
        if (!roomName) {
            res.redirect("/home");
            return;
        }
        let maxMembers = req.body["max-members"];
        if (!maxMembers || parseInt(maxMembers) > 10) {
            maxMembers = "10";
        }
        const author = user.username;
        const newRoom = new model.Room(roomName, author, maxMembers);
        db.addRoom(newRoom);

        res.redirect("/home");
    },
    deleteRoom: (db) => (req, res) => {
        const roomName = req.body["name"];
        if (roomName) {
            db.removeRoom(roomName);
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    },
    editAccount: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors = ["You must be logged in"];
            res.redirect("/");
            return;
        }
        let currentUser = db.getUser(user.username);
        const firstName = req.body["first-name"];
        const lastName = req.body["last-name"];

        if (utility.validateName(firstName) && utility.validateName(lastName)) {
            currentUser.firstName = firstName;
            currentUser.lastName = lastName;
            currentUser.usernameColor = req.body["username-color"];
            req.session.user = currentUser;
        }

        res.redirect("/account");
    }
};