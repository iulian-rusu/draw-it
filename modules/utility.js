module.exports = {
    calculateUsernameColors: (users, room) => {
        let colors = [];
        // efficiency
        for (let i = 0; i < room.messages.length; ++i) {
            for (let j = 0; j < users.length; ++j) {
                if (users[j].username == room.messages[i].username) {
                    colors.push(users[j].usernameColor);
                    break;
                }
            }
        }
        return colors;
    }
};