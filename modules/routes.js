/*
    routes.js - contains the controller logic for all application routes
*/

const { RoomMessage } = require("./model");
const schema = require("./schema");
const model = require("./model");
const utility = require("./utility");
const crypto = require("bcrypt");
const saltRounds = 10;
let errors = [];
const pleaseLogInMessage = "You must be logged in to do that";

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
            errors.push(pleaseLogInMessage);
            res.redirect("/");
            return;
        }
        db.searchRooms(null, rooms => {
            res.render('home', {
                loadMenuBar: true,
                pageTitle: "Home",
                styleList: ["tables.css", "home-style.css"],
                currentPageLink: "home",
                containerId: "home-page-container",
                rooms: rooms,
                utility: utility,
                errors: errors
            });
            errors = [];
        })
    },
    account: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors.push(pleaseLogInMessage);
            res.redirect("/");
            return;
        }
        db.getUser(user.username, user => {
            db.getUserRooms(user.username, userRooms => {
                res.render('account', {
                    loadMenuBar: true,
                    pageTitle: "Account",
                    styleList: ["tables.css", "account-style.css"],
                    currentPageLink: "account",
                    containerId: "account-page-container",
                    user: user,
                    userRooms: userRooms,
                    utility: utility,
                    errors: errors
                });
                errors = [];
            });
        });
    },
    room: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors.push(pleaseLogInMessage);
            res.redirect("/");
            return;
        }

        const roomName = req.query["name"];
        if (!roomName) {
            errors.push("No room specified");
            res.redirect("/");
            return;
        }
        db.addRoomMember(roomName, user.username, err => {
            if(err) {
                errors.push(err);
                res.redirect("/");
                return;
            }
            db.getPopulatedRoom(roomName, room => {
                if (!room) {
                    errors.push("Room doesn't exist");
                    res.redirect("/home");
                    return;
                }

                if (errors.length > 0) {
                    res.redirect("/");
                    return;
                }

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
            });
        });
    },
    leaveRoom: (db) => async (req, res) => {
        const username = req.body["username"];
        const roomName = req.body["roomName"];
        db.removeRoomMember(roomName, username, () => {
            res.sendStatus(200);
        })
    },
    logIn: (db) => async (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        db.getUser(username, user => {
            if (user === null) {
                errors.push("Bad credentials");
                res.redirect("/");
                return;
            }

            crypto.compare(password, user.password, (err, isSamePassword) => {
                if (err) {
                    res.redirect("/");
                    return;
                }
                if (!isSamePassword) {
                    errors.push("Bad credentials");
                    res.redirect("/");
                    return;
                }

                // remember user details in session
                req.session.user = user;

                res.redirect("/home");
            });
        });
    },
    register: (db) => (req, res) => {
        const username = req.body["username"];
        const password = req.body["password"];
        const passwordConfirm = req.body["password-confirm"];
        const firstName = req.body["first-name"];
        const lastName = req.body["last-name"];

        if (!utility.validateName(firstName)) {
            errors.push("First name is invalid");
        }

        if (!utility.validateName(lastName)) {
            errors.push("Last name is invalid");
        }

        if (!utility.validatePassword(password)) {
            errors.push("Password too short");
        }

        if (password != passwordConfirm) {
            errors.push("Passwords don't match");
        }

        crypto.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) {
                res.redirect("/");
                return;
            }
            db.userExists(username, exists => {
                if (exists) {
                    errors.push(`Username '${username}' is already taken`);
                }

                if (errors.length > 0) {
                    res.redirect("/");
                    return;
                }

                const newUser = new model.User(username, firstName, lastName, hashedPassword);
                db.addUser(newUser, result => {
                    // remember user details in session
                    req.session.user = newUser;
                    res.redirect("/home");
                });
            })
        });
    },
    searchRoom: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors.push(pleaseLogInMessage);
            res.redirect("/");
            return;
        }
        const roomName = req.query["name"].toLowerCase();
        if (roomName.length === 0) {
            res.redirect("/home");
            return;
        }
        db.searchRooms(roomName, rooms => {
            res.render('home', {
                loadMenuBar: true,
                pageTitle: "Home",
                styleList: ["tables.css", "home-style.css"],
                currentPageLink: "home",
                containerId: "home-page-container",
                rooms: rooms,
                utility: utility,
                errors: errors
            });
            errors = [];
        })
    },
    postMessage: (db) => (req, res) => {
        const msgBody = req.body["body"];
        const roomName = req.body["roomName"];
        const username = req.body["username"];

        if (roomName && msgBody && username) {
            db.postRoomMessage(roomName, new RoomMessage(username, msgBody), () => {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(400);
        }
    },
    createRoom: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors.push(pleaseLogInMessage);
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
        db.addRoom(newRoom, result => {
            res.redirect("/home");
        });
    },
    deleteRoom: (db) => (req, res) => {
        const roomName = req.body["name"];
        if (roomName) {
            db.removeRoom(roomName, result => {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(400);
        }
    },
    editAccount: (db) => (req, res) => {
        const user = req.session.user;
        if (!user) {
            errors.push(pleaseLogInMessage);
            res.redirect("/");
            return;
        }
        const firstName = req.body["first-name"];
        const lastName = req.body["last-name"];
        const usernameColor = req.body["username-color"];
        if (utility.validateName(firstName) && utility.validateName(lastName)) {
            db.updateUser(user.username, {firstName, lastName, usernameColor}, updated => {
                req.session.user = updated;
                res.redirect("/account");
            });
        }
    }
};