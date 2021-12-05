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

module.exports = {
  getUserByEmail,
};