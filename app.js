const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const utility = require("./modules/utility")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'))

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
        rooms: utility.getAllRooms()
    });
});

app.get('/account', (req, res) => {
    res.render('account', {
        loadMenuBar: true,
        pageTitle: "Account",
        styleList: ["tables.css", "account-style.css"],
        currentPageLink: "account",
        containerId: "account-page-container",
        user: utility.getUser("placeholder-username"),
        userRooms: utility.getUserRooms("placeholder-username")
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

app.post("/log-in", (req, res) => { res.redirect("/home") });
app.post("/register", (req, res) => { res.redirect("/home") });

app.get("/search-room", (req, res) => { 
    const roomName = req.query["room-name"].toLowerCase();
    if(roomName.length === 0) {
        res.redirect("/home");
    }
    const existingRooms = utility.getAllRooms();
    const foundRooms = []
    console.log(roomName);
    for(let i=0; i<existingRooms.length; ++i) {
        console.log(existingRooms[i].name);
        if(existingRooms[i].name.toLowerCase().includes(roomName)) {
            foundRooms.push(existingRooms[i]);
        }
    }
    res.render('home', {
        loadMenuBar: true,
        pageTitle: "Home",
        styleList: ["tables.css", "home-style.css"],
        currentPageLink: "home",
        containerId: "home-page-container",
        rooms: foundRooms
    });
});

app.post("/create-room", (req, res) => {
    const roomName = req.body["room-name"];
    let maxMembers = req.body["max-members"];
    if(parseInt(maxMembers) > 10) {
        maxMembers = "10";
    }
    const author = "admin";
    const existingRooms = utility.getAllRooms();
    existingRooms.push({ name: roomName, creator: author, maxMembers: maxMembers, currentMembers: 0 });
    res.render('home', {
        loadMenuBar: true,
        pageTitle: "Home",
        styleList: ["tables.css", "home-style.css"],
        currentPageLink: "home",
        containerId: "home-page-container",
        rooms: existingRooms
    });
});

app.post("/edit-account", (req, res) => {
    let currentUser = utility.getUser("placeholder-username");
    currentUser.firstName = req.body["first-name"];;
    currentUser.lastName = req.body["last-name"];;
    currentUser.usernameColor = req.body["username-color"];;

    res.render('account', {
        loadMenuBar: true,
        pageTitle: "Account",
        styleList: ["tables.css", "account-style.css"],
        currentPageLink: "account",
        containerId: "account-page-container",
        user: currentUser,
        userRooms: utility.getUserRooms("placeholder-username")
    });
});

app.post("/send-message", (req, res) => {
    res.sendStatus(200);
});

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost: ${port}`));