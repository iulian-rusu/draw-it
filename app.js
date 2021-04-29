const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const utility = require("./modules/utility");
const model = require("./modules/model");
const { User } = require('./modules/model');
const app = express();
const db = new model.DBAccess()

function insertTestData(db) {
    const testUser = new model.User("test", "Test FN", "Test LN", "testtest");
    const testRoom1 = new model.Room("room1", "test", 10);
    const testRoom2 = new model.Room("room two", "test", 2);

    db.addUser(testUser);
    db.addRoom(testRoom1);
    db.addRoom(testRoom2);
}

insertTestData(db);

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', {
        loadMenuBar: false,
        pageTitle: "Welcome to Draw It!",
        styleList: ["index-style.css"],
        currentPageLink: "index",
        containerId: "front-page-container",
    });
});

app.get('/home', (req, res) => {
    res.render('home', {
        loadMenuBar: true,
        pageTitle: "Home",
        styleList: ["tables.css", "home-style.css"],
        currentPageLink: "home",
        containerId: "home-page-container",
        rooms: db.searchRooms()
    });
});

app.get('/account', (req, res) => {
    res.render('account', {
        loadMenuBar: true,
        pageTitle: "Account",
        styleList: ["tables.css", "account-style.css"],
        currentPageLink: "account",
        containerId: "account-page-container",
        user: db.getUser("test"),
        userRooms: db.getUserRooms("test")
    });
});

app.get('/room', (req, res) => {
    res.render('room', {
        loadMenuBar: true,
        pageTitle: "Room",
        styleList: ["tables.css", "room-style.css"],
        currentPageLink: "room",
        containerId: "room-page-container",
        roomMembers: utility.getRoomMembers("placeholder-room-name"),
        roomMessages: utility.getRoomMessages("placeholder-room-name")
    });
});

app.post("/log-in", (req, res) => {
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

    res.redirect("/home");
});

app.post("/register", (req, res) => {
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

    const newUser = new User(username, firstName, lastName, password);
    db.addUser(newUser);

    res.redirect("/home");
});

app.get("/search-room", (req, res) => {
    const roomName = req.query["room-name"].toLowerCase();
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
});

app.post("/create-room", (req, res) => {
    const roomName = req.body["room-name"];
    let maxMembers = req.body["max-members"];
    if (parseInt(maxMembers) > 10) {
        maxMembers = "10";
    }
    const author = "test";
    const newRoom = new model.Room(roomName, author, maxMembers);
    db.addRoom(newRoom);

    res.redirect("/home");
});

app.post("/edit-account", (req, res) => {
    let currentUser = db.getUser("test");
    currentUser.firstName = req.body["first-name"];;
    currentUser.lastName = req.body["last-name"];;
    currentUser.usernameColor = req.body["username-color"];;

    res.redirect("/account");
});

app.post("/send-message", (req, res) => {
    res.sendStatus(200);
});

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost: ${port}`));