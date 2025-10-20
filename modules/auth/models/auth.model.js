const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../data/users.json');

const findUserByEmail = (email) => {
  const users = JSON.parse(fs.readFileSync(dataPath));
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  const users = JSON.parse(fs.readFileSync(dataPath));
  return users.find(user => user.id === parseInt(id));
};

const createUser = (userData) => {
  const users = JSON.parse(fs.readFileSync(dataPath));
  const newUser = {
    id: users.length + 1,
    ...userData,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  return newUser;
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser
};
