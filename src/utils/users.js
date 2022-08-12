const users = [];
function removeUser(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
function getUser(id) {
  const user = users.find((user) => user.id === id);
  return user;
}
function getUsersOfRoom(room) {
  return users.filter((user) => user.room === room);
}
function addUser({ username, room, id }) {
  if (!username || !room) {
    return {
      error: "username and room must be provided",
    };
  }
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const userIsExist = users.find(
    (user) => user.username === username && user.room === room
  );
  if (userIsExist) {
    return {
      error: "User already exists",
    };
  }
  const user = {
    username,
    room,
    id,
  };
  users.push(user);
  return { user };
}
module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersOfRoom,
};
