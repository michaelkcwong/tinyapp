const { assert } = require('chai');
//function for checking if the user already exists in users database
const { getUserByEmail } = require("../helpers");
//function that generates a random string for user IDS
const { generateRandomString } = require("../helpers");
//function for checking if the user's password matches what is in the userDatabase
const { passwordMatch } = require("../helpers");
//function that gets user specific url from database
const { urlsForUser }= require("../helpers");
//function that gets the user from the userDatabase
const { findUser } = require("../helpers");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers).id;
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput);
  });

  it('should return undefined with a non-existent email', function() {
    const user = getUserByEmail("non-existent@example.com", testUsers).id;
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput);
  });

});

describe('getRandomString', function() {
  it('should return a random string of 6 numbers and/or characters', function() {
    const string1 = generateRandomString();
    const string2 = generateRandomString();
    const user = string1;
    const expectedOutput = string2;

    assert.notEqual(user, expectedOutput);
  });
});