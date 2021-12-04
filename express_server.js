//Requiring Express Package
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//Requiring Cookie Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//function that generates a random string for user IDS
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
  };

//Template view engine to EJS
app.set("view engine", "ejs");

//Database of shortURL and longURL
const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com",
};

//Database of users
const usersDatabase = { 
  "ab123": {
    id: "ab123", 
    email: "test@email.com", 
    password: "abc"
  }
};

//function for checking if the user already exists in users database
const existingUserInUsers = (email) => {
  for (let obj in usersDatabase) {
    let user = usersDatabase[obj];
    if (user.email === email) {
      return user;
  }
}
  return false;
};

//function for checking if the user's password matches what is in the userDatabase
const passwordMatch = (user, password) => {
  if (user.password === password) {
    return true;
  }
  return false;
};

//function that gets the user from the userDatabase
findUserByEmail = (object, cookie) => {
  return object[cookie];
};

// /localhost:8080
app.get("/", (req, res) => {
  res.send("Hello!");
});

// My URLs /urls page
app.get("/urls", (req, res) => {
  const user = findUserByEmail(usersDatabase, req.cookies["user_id"]);
  const templateVars = {
    urls: urlDatabase,
    user: user
  };
  res.render("urls_index", templateVars);
});

// GET /login page
app.get("/login", (req, res) => {
  const user = findUserByEmail(usersDatabase, req.cookies["user_id"]);
  const templateVars = {
    user:user
  };
  res.render("login", templateVars);
});

// Login into tinyapp
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (existingUserInUsers(email)) {
    const user = existingUserInUsers(email);
    if (passwordMatch(user, password)) {
      res.cookie("user_id", user.id);
      return res.redirect("/urls");
    }
  }
  return res.status(403).send("Login email and password combination is not in our records!")
  
});

// GET /register page
app.get('/register', (req, res) => {
  const user = findUserByEmail(usersDatabase, req.cookies["user_id"]);
  const templateVars = {
    user: user
  };
  res.render('registration', templateVars)
});

// POST /register new user
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  randomID = generateRandomString();
  const newUser = {};

  //validate information
  if (!email || !password) {
    return res.status(400).send('Email and password cannot be empty!');
  }

//validate if user exists
if(existingUserInUsers(email)) {
  return res.status(400).send('Email is already registered!');
}
  newUser["id"] = randomID
  newUser["email"] = req.body.email;
  newUser["password"] = req.body.password;
  res.cookie("user_id", newUser["id"]);
  usersDatabase[randomID] = newUser;
  res.redirect('/urls');
});

// Create TinyURL page /urls/new
app.get("/urls/new", (req, res) => {
  if (req.cookies["user_id"]) {
    const user = findUserByEmail(usersDatabase, req.cookies["user_id"]);
    const templateVars = {
      user: user
    };
    return res.render("urls_new", templateVars);
  }
  return res.redirect("/login");
});

// TinyURL Creation page 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
  });


// Delete URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});


// Logging Out 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect(`/login`);
});

// Edit URL
app.post("/urls/:shortURL/update", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

// after TinyURL page /urls/TinyURL page
app.get("/urls/:shortURL", (req, res) => {
  const user = findUserByEmail(usersDatabase, req.cookies["user_id"]);
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: user
  };
  req.params.shortURL = templateVars.shortURL;
  res.render("urls_show", templateVars);
});

// TinyURL redirect to website
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
