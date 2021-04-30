module.exports = {
    index: (req, res) => {
        res.render('index', {
            loadMenuBar: false,
            pageTitle: "Welcome to Draw It!",
            styleList: ["index-style.css"],
            currentPageLink: "index",
            containerId: "front-page-container",
        });
    },
    home: (db) => (req, res) => {
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
        res.render('account', {
            loadMenuBar: true,
            pageTitle: "Account",
            styleList: ["tables.css", "account-style.css"],
            currentPageLink: "account",
            containerId: "account-page-container",
            user: db.getUser("test"),
            userRooms: db.getUserRooms("test")
        });
    },
    room: (db) => (req, res) => {
        res.render('room', {
            loadMenuBar: true,
            pageTitle: "Room",
            styleList: ["tables.css", "room-style.css"],
            currentPageLink: "room",
            containerId: "room-page-container",
            roomMembers: db.getRoomMembers("placeholder-room-name"),
            roomMessages: db.getRoomMessages("placeholder-room-name")
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

        const newUser = new User(username, firstName, lastName, password);
        db.addUser(newUser);

        res.redirect("/home");
    },
    searchRoom: (db) => (req, res) => {
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
    },
    createRoom: (db) => (req, res) => {
        const roomName = req.body["room-name"];
        let maxMembers = req.body["max-members"];
        if (parseInt(maxMembers) > 10) {
            maxMembers = "10";
        }
        const author = "test";
        const newRoom = new model.Room(roomName, author, maxMembers);
        db.addRoom(newRoom);

        res.redirect("/home");
    },
    editAccount: (db) => (req, res) => {
        let currentUser = db.getUser("test");
        currentUser.firstName = req.body["first-name"];
        currentUser.lastName = req.body["last-name"];
        currentUser.usernameColor = req.body["username-color"];
        res.redirect("/account");
    }
};