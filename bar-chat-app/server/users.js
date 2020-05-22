const users = [];
const addUser = ({id, name}) => {
    name = name.trim().toLowerCase();
    //const existingUser = users.find((user) => user.room === room && user.name === name);
    const user = { id, name}
    users.push(user);
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getuser = (id) => {
    users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom};