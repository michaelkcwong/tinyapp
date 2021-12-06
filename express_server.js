//Server Set up

//Requiring Express Package
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bcrypt = require('bcrypt');

//Requiring Cookie Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Requiring Cookie Session
const cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
}));

//Template view engine to EJS
app.set("view engine", "ejs");

//Databases

//Database of shortURL and longURL
const urlDatabase = {
  "b2xVn2": {longURL: "https://www.lighthouselabs.ca", userID: "ab123"},
  "9sm5xK": {longURL: "https://www.google.com", userID: "ab123"}
};

//Database of users
const usersDatabase = { 
  "ab123": {
    id: "ab123", 
    email: "test@email.com", 
    password: bcrypt.hashSync("123",10)
  }
};

//Helper Functions

const {
  getUserByEmail,
  generateRandomString,
  passwordMatch,
  urlsForUser,
  findUser 
} = require('./helpers')

//Get Requests

// localhost:8080 Home Page
app.get("/", (req, res) => {
  res.send("Hello!");
});

//User not found page
app.get("/usernotfound", (req, res) => {
  if (!req.session.user_id) {
    const user = null;
    const templateVars = {
      user: user,
    };
    return res.render("require_login", templateVars);
  }
  return res.redirect("/urls");
});

//My URLs page
app.get("/urls", (req, res) => {
  if(req.session.user_id) {
    const user = findUser(usersDatabase, req.session["user_id"]);
    const urlList = urlsForUser(req.session["user_id"], urlDatabase);
    const templateVars = {
      urls: urlList,
      user: user,
    };
  return res.render("urls_index", templateVars);
}
return res.redirect("/usernotfound");
});

// Login page
app.get("/login", (req, res) => {
  const user = findUser(usersDatabase, req.session["user_id"]);
  const templateVars = {
    user:user
  };
  res.render("login", templateVars);
});

//Register page
app.get('/register', (req, res) => {
  const user = findUser(usersDatabase, req.session["user_id"]);
  const templateVars = {
    user: user
  };
  res.render('registration', templateVars)
});

//Create TinyURL page
app.get("/urls/new", (req, res) => {
  if (req.session["user_id"]) {
    const user = findUser(usersDatabase, req.session["user_id"]);
    const templateVars = {
      user: user
    };
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/usernotfound");
});

//After TinyURL page submission page
app.get("/urls/:shortURL", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (cookie && urlDatabase[shortURL].userID === cookie) {
    const user = findUser(usersDatabase, cookie);
    const templateVars = { 
      shortURL: shortURL, 
      longURL: urlsForUser(cookie, urlDatabase)[shortURL],
      user: user
    };
    req.params.shortURL = templateVars.shortURL;
    return res.render("urls_show", templateVars);
  }
  return res.redirect("/usernotfound");
});

//TinyURL redirect to website
app.get("/u/:shortURL", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL
  if(cookie && urlDatabase[shortURL].userID === cookie) {
    const user = findUser(usersDatabase, cookie);
    const templateVars = {
      shortURL: shortURL,
      longURL: urlsForUser(cookie)[shortURL],
      user: user
    };
    req.params.shortURL = templateVars.shortURL;
    return res.render("urls_show", templateVars);
  }
  res.redirect("/usernotfound");
});

//Post requests

//Login into tinyapp
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send('Email and/or password cannot be empty!');
  }
  if (getUserByEmail(email, usersDatabase)) {
    const user = getUserByEmail(email, usersDatabase);
    if (passwordMatch(user, password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    }
  }
  return res.status(403).send("Login email and password combination is not in our records!")
});

//Registering new user
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  randomID = generateRandomString();
  const newUser = {};

  //Validate if theres missing information
  if (!email || !password) {
    return res.status(400).send('Email and/or password cannot be empty!');
  }

  //Validate if user exists
  if(getUserByEmail(email, usersDatabase)) {
    return res.status(400).send('Email is already registered!');
  }

  newUser["id"] = randomID
  newUser["email"] = req.body.email;
  newUser["password"] = bcrypt.hashSync(req.body["password"],10);
  req.session.user_id = newUser["id"];
  usersDatabase[randomID] = newUser;
  res.redirect('/urls');
});

//TinyURL Creation
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const cookie = req.session.user_id;
  const longURL = req.body["longURL"];

  if (!longURL) {
    return res.status(400).send('Please type in URL!');
  }

  urlDatabase[shortURL] = {longURL: req.body["longURL"], userID: cookie};
  res.redirect(`/urls/${shortURL}`);
  });

//Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL;
  if (cookie && urlDatabase[shortURL].userID === cookie) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls");
  }
  return res.redirect("/usernotfound");
});

//Logging Out 
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect(`/login`);
});

//Edit URL
app.post("/urls/:shortURL/update", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL;
  const longURL = req.body["longURL"];

  if (!longURL) {
    return res.status(400).send('Please type in URL!');
  }

  if (cookie && urlDatabase[shortURL].userID === cookie) {
  delete urlDatabase[req.params.shortURL]
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL:req.body["longURL"], userID: cookie};
  return res.redirect(`/urls/${shortURL}`);
}
return res.redirect("/usernotfound")
});

//Tiny app listening on PORT 
app.listen(PORT, () => {
  console.log(`Tinyapp listening on port ${PORT}!`);
});
