const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

//Database of shortURL and longURL
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Hello http://localhost:8080/
app.get("/", (req, res) => {
  res.send("Hello!");
});

// My URLs http://localhost:8080/urls/
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Login to the page
app.post("/login", (req, res) => {
  res.cookie("username", req.body["username"]);
  res.redirect(`urls`);
});

// Create TinyURL http://localhost:8080/urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Post Submission http://localhost:8080/urls/udjxhd
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
  });

// URL Delete button
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

// Update button
app.post("/urls/:shortURL/update", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

// Post of Post submission 
app.get("/urls/:shortURL", (req, res) => {
const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
req.params.shortURL = templateVars.shortURL;
res.render("urls_show", templateVars);
});

// TinyURL for x
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function generateRandomString() {
return Math.random().toString(36).substring(2,8);
};