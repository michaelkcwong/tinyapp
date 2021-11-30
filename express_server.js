//Requiring Express Package
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

//Requiring Cookie Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

//Template view engine to EJS
app.set("view engine", "ejs");

//Database of shortURL and longURL
const urlDatabase = {
  "b2xVn2": "https://www.lighthouselabs.ca",
  "9sm5xK": "https://www.google.com",
};

const userDatabase = {};

// /localhost:8080
app.get("/", (req, res) => {
  res.send("Hello!");
});

// My URLs /urls page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Create TinyURL page /urls/new
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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

// Login
app.post("/login", (req, res) => {
  res.cookie("username", req.body["username"]);
  res.redirect(`/urls`);
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
const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
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

const generateRandomString = function() {
return Math.random().toString(36).substring(2,8);
};