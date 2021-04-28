const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path')
const utility = require("./modules/utility")

const app = express();

app.set('view engine', 'ejs');

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

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost: ${port}`));