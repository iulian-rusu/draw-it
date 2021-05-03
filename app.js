require('dotenv').config()
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require("http");
const MongoDB = require("./modules/database");
const SocketListener = require("./modules/socket");
const routes = require("./modules/routes");
const port = 7070;

// create app
const app = express();
app.set('view engine', 'ejs');

// create http server
const server = http.createServer(app);

// initialize database connection
const db = new MongoDB(() => server.listen(port, () => console.log(`Server running on http://localhost:${port}`)))

// initialize socket listener
const socketListener = new SocketListener(server, db);
socketListener.run();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(express.static('public'));
app.use(session({
    secret: 'supermegasecretphrase',
    resave: true,
    saveUninitialized: true
}));

// app routes 
app.get('/', routes.index);
app.get('/log-out', routes.logout);
app.get('/home', routes.home(db));
app.get('/account', routes.account(db));
app.get('/room', routes.room(db));
app.get("/search-room", routes.searchRoom(db));
app.post("/log-in", routes.logIn(db));
app.post("/register", routes.register(db));
app.post("/room", routes.createRoom(db));
app.post("/edit-account", routes.editAccount(db));
app.delete("/room", routes.deleteRoom(db));