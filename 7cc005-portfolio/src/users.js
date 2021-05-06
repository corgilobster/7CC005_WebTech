const users = {};

function registerUser(sessionID, name, password){

    users[sessionID] = {
        name: name,
        password: password
    };
}

function getUser(sessionID) {
    return users[sessionID];
}

export const registerUser = registerUser,
            getUser = getUser;