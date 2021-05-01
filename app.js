const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const utility = require("./modules/utility");
const model = require("./modules/model");
const requests = require("./modules/requests");

const db = new model.DBAccess()
const app = express();

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

app.get('/', requests.index);
app.get('/home', requests.home(db));
app.get('/account', requests.account(db));
app.get('/room', requests.room(utility));
app.get("/search-room", requests.searchRoom(db));

app.post("/log-in", requests.logIn(db));
app.post("/register", requests.register(db));
app.post("/create-room", requests.createRoom(db));
app.post("/edit-account", requests.editAccount(db));
app.post("/send-message", (req, res) => { res.sendStatus(200); });

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));