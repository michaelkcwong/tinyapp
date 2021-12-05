//function for checking if the user already exists in users database
const getUserByEmail = function(email, usersDatabase) {
  for (let obj in usersDatabase) {
    let user = usersDatabase[obj];
    if (user.email === email) {
      return user;
  }
}
  return false;
};

//function that generates a random string for user IDS
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
  };

//function for checking if the user's password matches what is in the userDatabase
const bcrypt = require("bcrypt");
const passwordMatch = (user, password) => {
  if (bcrypt.compareSync(password, user.password)) {
    return true;
  }
  return undefined;
};

//function that gets user specific url from database
const urlsForUser = (userID, urlDatabase) => {
  const userURL = {};

  for (let obj in urlDatabase) {
    let urlList = urlDatabase[obj];
    if (urlList.userID === userID) {
      userURL[obj] = urlList.longURL;
    }
  }
  return userURL;
}

//function that gets the user from the userDatabase
const findUser = (object, cookie) => {
  return object[cookie];
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  passwordMatch,
  urlsForUser,
  findUser
};