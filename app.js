const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const utility = require("./modules/utility");
const model = require("./modules/model");
const routes = require("./modules/routes");

const db = new model.DBAccess()
const app = express();

function insertTestData(db) {
    const testUser1 = new model.User("test", "Test FN", "Test LN", "test");
    const testUser2 = new model.User("test2", "John", "Smith", "test");
    const testRoom1 = new model.Room("room1", "test", 10);
    const testRoom2 = new model.Room("room two", "test2", 2);

    db.addUser(testUser1);
    db.addUser(testUser2);
    db.addRoom(testRoom1);
    db.addRoom(testRoom2);
}

insertTestData(db);

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));
app.use(session({
    secret: 'supermegasecretphrase',
    resave: true,
    saveUninitialized: true
}));

app.get('/', routes.index);
app.get('/log-out', routes.logout);
app.get('/home', routes.home(db));
app.get('/account', routes.account(db));
app.get('/room', routes.room(db));
app.get("/search-room", routes.searchRoom(db));

app.post("/log-in", routes.logIn(db));
app.post("/register", routes.register(db));
app.post("/post-message", routes.postMessage(db));
app.post("/create-room", routes.createRoom(db));
app.post("/delete-room", routes.deleteRoom(db));
app.post("/edit-account", routes.editAccount(db));

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));