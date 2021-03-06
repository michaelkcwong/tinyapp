const { assert } = require('chai');
const bcrypt = require("bcrypt");

const {
  getUserByEmail,
  generateRandomString,
  passwordMatch,
  urlsForUser,
  findUser 
} = require('../helpers')

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

const user = {
  id: "userRandomID", 
  email: "user@example.com", 
  password: bcrypt.hashSync("purple-monkey-dinosaur",10)
};

const urlDatabase = {
  "b2xVn2": {longURL: "https://www.lighthouselabs.ca", userID: "abc"},
  "9sm5xK": {longURL: "https://www.google.com", userID: "def"}
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

  it('should return a string', function() {
    const characters = generateRandomString();
    const user = typeof characters;
    const expectedOutput = "string";

    assert.equal(user, expectedOutput);
  });
});

describe('passwordMatch', function() {
  it('should return true if the password matches in our user database', function() {

  const password = "purple-monkey-dinosaur";
  const userInput = passwordMatch(user, password);
  const expectedOutput = true;

  assert.equal(userInput, expectedOutput);
  });

  it('should return undefined if the password does not match in our user database', function() {

  const password = "password not match";
  const userInput = passwordMatch(user, password);
  const expectedOutput = undefined;
  
  assert.equal(userInput, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return {shortURLs: longURLs} objects from specific user in our url database', function() {
  const userInput = urlsForUser("abc", urlDatabase);
  const expectedOutput = {"b2xVn2": "https://www.lighthouselabs.ca"};

  assert.deepEqual(userInput, expectedOutput);
  });
  
  it('should return an empty object if the user is not in our url database', function() {
  const userInput = urlsForUser("ghi", urlDatabase);
  const expectedOutput = {};

  assert.deepEqual(userInput, expectedOutput);
  });
});

describe('findUser', function() {
  it('should return a specific user object from the database with user id', function() {
  const user = findUser(testUsers, "userRandomID");
  const expectedOutput = {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
    };

    assert.deepEqual(user, expectedOutput);

  });
  it('should return undefined if user id is not in the database', function() {
  const user = findUser(testUsers, "123");
  const expectedOutput = undefined;
  
  assert.equal(user, expectedOutput);
  });
});