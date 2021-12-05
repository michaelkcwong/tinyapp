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

module.exports = {
  getUserByEmail,
  generateRandomString,
};