const Cryptr = require("cryptr");

const bcrypt = require("bcrypt");
const userService = require("../user/user.service");

const cryptr = new Cryptr(process.env.SECRET1 || "Secret-Puk-1234");

async function login(email, password) {
  const user = await userService.getByEmail(email);
  if (!user) return Promise.reject("Invalid email or password");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject("Invalid email or password");

  delete user.password;
  return user;
}

async function signup(email, password, name) {
  const saltRounds = 10;
  if (!email || !password || !name)
    return Promise.reject("email and password are required!");

  const hash = await bcrypt.hash(password, saltRounds);
  let userToAdd = await userService.add({
    email: email,
    password: hash,
    name: name,
    isAdmin: false,
    friends: [],
  });
  return userToAdd;
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user));
}

function validateToken(loginToken) {
  try {
    const json = cryptr.decrypt(loginToken);
    const loggedinUser = JSON.parse(json);
    return loggedinUser;
  } catch (err) {
    console.log("Invalid login token");
  }
  return null;
}

module.exports = {
  signup,
  login,
  getLoginToken,
  validateToken,
};
