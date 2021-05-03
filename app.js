require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDB = require("./modules/database");
const routes = require("./modules/routes");

const app = express();
const db = new MongoDB(result => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))

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
app.post("/room", routes.createRoom(db));
app.post("/leave-room", routes.leaveRoom(db))
app.post("/edit-account", routes.editAccount(db));

app.delete("/room", routes.deleteRoom(db));

const port = 7070;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));