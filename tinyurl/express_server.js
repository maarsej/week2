 /*jshint esversion: 6 */
 /*
 Created by: Jacob Maarse
 Date Created: March 20th, 2018
 Last Editted: March 21st, 2018
 Purpose: tinyurl project for lighthouse labs
 Function: -Server that handles requests
           -Shortens longer urls and when given the shortened url it redirects to the original url
           -User registration to create log in and gain access to the sites functionality
           -Limits users access to only be able to create/edit/delete urls that they themselves have created
 */
// Imports and Declarations
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const methodOverride = require('method-override')
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.use(cookieSession({
  name: 'session',
  keys: ['secret'],
}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { url: "http://www.lighthouselabs.ca",
              urlID: 'master',
              visits: 0},
  "9sm5xK": { url: "http://www.google.com",
              urlID: 'master',
              visits: 0}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  },
  "f1pnl5": {
    id: "f1pnl5",
    email: "user3@example.com",
    password: bcrypt.hashSync("password2", 10)
  },
  "master": {
    id: "master",
    email: "test@test.com",
    password: bcrypt.hashSync("123", 10)
  }
}

//Function declarations

function generateRandomString(){
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);  //random number ==> to any letter/number
}

function getID(email) {
   for (let user in users) {
    if (Object.values(users[user]).indexOf(email)>-1) {
      return user
    }
  }
};

function urlExists(id) {
  for (let urls in urlDatabase) {
    if (id === urls) {
      return true;
    }
  }
  return false;
}

function emailCheck(email) {
  for (let user in users) {
    if (Object.values(users[user]).indexOf(email)>-1) {
      return true;
    }
  }
  return false;
};
function passCheck(password, id) {
    return bcrypt.compareSync(password, users[id].password);
};

//Server body to handle requests, using GET and POST methods only

app.get("/", (req, res) => {
  let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (templateVars.userID !== undefined){
    res.redirect("/urls");
  } else {
    res.redirect("/login");
  }
});

app.get("/urls", (req, res) => {
  let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let newID = generateRandomString();
  let check = true;
  if (!req.session["userID"]){
    res.end('You must be logged in to generate URLs')
  } else if (req.body.longURL === ''){
    res.statusCode = 400;
    res.end("Cant add empty URL");
  } else {
    while (check === true){
      if (urlDatabase[newID] !== undefined) {
        let newID = generateRandomString();
      } else {
        urlDatabase[newID] = {};
        urlDatabase[newID].url = req.body.longURL;
        urlDatabase[newID].urlID = req.session["userID"];
        urlDatabase[newID].visits = 0;
        check = false;
      }
    }
    res.redirect(`/urls/${newID}`);
  }
});

app.get("/urls/new", (req, res) => {
   let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (templateVars.userID !== undefined){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});
app.post("/urls/new", (req, res) => {
  let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (templateVars.userID !== undefined){
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:id", (req, res) => {
   let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (!urlExists(req.params.id)){
    res.end("URL for given ID doesnt exist")
  } else if (!req.session["userID"]){
    res.end("Must be logged in")
  } else if (urlDatabase[req.params.id].urlID !== req.session["userID"]){
    res.end("You do not own this url")
  } else {
    res.render("urls_show", templateVars);
  }
});

app.put("/urls/:id", (req, res) => {
   let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (req.body.updateURL === ''){
    res.statusCode = 400;
    res.end("Cant update with a blank URL");
  } else if (req.session['userID'] === urlDatabase[req.params.id].urlID){
    urlDatabase[req.params.id].url = req.body.updateURL;
    res.redirect('/urls');
  } else {
    res.statusCode = 401;
    res.end("Unauthorized request");
  }
});
app.delete("/urls/:id", (req,res) => {
  if (req.session['userID'] === urlDatabase[req.params.id].urlID){
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  } else {
    res.statusCode = 401;
    res.end("Unauthorized request");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].url === undefined) {
    res.statusCode = 404;
    res.end("Unknown Path");
  } else {
    res.statusCode = 301;
    urlDatabase[req.params.shortURL].visits += 1;
    res.redirect(urlDatabase[req.params.shortURL].url);
  }
});

app.get("/register", (req,res) => {
   let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (!req.session["userID"]){
    res.render("urls_register", templateVars);
  } else {
    res.redirect('/urls')
  }
});
app.post("/register", (req,res) => {
  // store user data
  if (req.body.email === '' || req.body.password === ''){
    res.statusCode = 400;
    res.end("empty registration field");
  } else if (emailCheck(req.body.email)) {
    res.statusCode = 400;
    res.end("Email already in use");
  } else {
  let id = generateRandomString();
  users[id]= { 'id' : id,
             'email': req.body.email,
          'password': bcrypt.hashSync(req.body.password, 10)
              };
  // add user_ID to cookie
  req.session['userID'] = id;
  }
  //redirect to front page
  res.redirect("/urls")
});

app.get("/login", (req,res) => {
  let templateVars = { userID: req.session["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (!req.session["userID"]){
    res.render('urls_login', templateVars);
  } else {
    res.redirect('/urls')
  }
});
app.post("/login", (req,res) => {
  // check user data
  if (req.body.email === '' || req.body.password === ''){
    res.statusCode = 400;
    res.end("empty login field");
  } else if (!emailCheck(req.body.email) || !passCheck(req.body.password, getID(req.body.email))) {
    res.statusCode = 400;
    res.end("Incorrect email/password combination");
  } else {
  // add user_ID to cookie
  req.session['userID'] = getID(req.body.email);
  }
  //redirect to front page
  res.redirect("/urls")
});

app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect('/urls');
})

// Port that server listens on for requests
app.listen(PORT, () => {
  console.log(`Tiny URL App listening on port ${PORT}!`);
});