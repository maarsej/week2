 /*jshint esversion: 6 */

var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": { url: "http://www.lighthouselabs.ca",
              urlID: 'master'},
  "9sm5xK": { url: "http://www.google.com",
              urlID: 'master'}
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  },
  "f1pnl5": {
    id: "f1pnl5",
    email: "user3@example.com",
    password: "password2"
  },
  "master": {
    id: "master",
    email: "test@test.com",
    password: "123"
  }
}
// let userInfo[] = {
//     id: "",
//     email: "",
//     password: ""
//   }

function generateRandomString(){
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);  //random number ==> to any letter/number
}

// for (i = 0; i<20; i++){
//   console.log(generateRandomString());
function getID(email) {
   for (let user in users) {
    if (Object.values(users[user]).indexOf(email)>-1) {
      return user
    }
  }
};

function emailCheck(email) {
  for (let user in users) {
    if (Object.values(users[user]).indexOf(email)>-1) {
      return true;
    }
  }
  return false;
};
function passCheck(password, id) {
    return (Object.values(users[id]).indexOf(password)>-1);
};

app.get("/", (req, res) => {
  res.end("Hello! Welcome to tiny URLs, try /urls for some more interesting content");
});

app.get("/urls", (req, res) => {
  let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let newID = generateRandomString();
  let check = true;
  while (check === true){
    if (urlDatabase[newID] !== undefined) {
      let newID = generateRandomString();
    } else {
      urlDatabase[newID] = {};
      urlDatabase[newID].url = req.body.longURL;
      urlDatabase[newID].urlID = req.cookies["userID"];
      check = false;
    }
  }
  res.redirect(`/urls/${newID}`);
});

app.get("/urls/new", (req, res) => {
   let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (templateVars.userID !== undefined){
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});
app.post("/urls/new", (req, res) => {
  let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  if (templateVars.userID !== undefined){
    res.render("urls_new", templateVars);
  } else {
    res.render("urls_login", templateVars);
  }
});

app.get("/urls/:id", (req, res) => {
   let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
   let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL].url === undefined) {
    res.statusCode = 404;
    console.log(res.statusCode);
    res.end("Unknown Path");
  } else {
    res.statusCode = 301;
    console.log(res.statusCode);
    res.redirect(urlDatabase[req.params.shortURL].url);
  }
});

app.get("/register", (req,res) => {
   let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render("urls_register", templateVars);
});

app.get("/login", (req,res) => {
   let templateVars = { userID: req.cookies["userID"],
  users: users, urls: urlDatabase, key: req.params.id};
  res.render('urls_login', templateVars);
});

app.post("/logout", (req,res) => {
  res.clearCookie('userID');
  res.redirect('urls');
})

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
  res.cookie('userID', getID(req.body.email));
  }
  //redirect to front page
  res.redirect("/urls")
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
          'password': req.body.password
              };
  console.log(users);
  // add user_ID to cookie
  res.cookie('userID', id);
  }
  //redirect to front page
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req,res) => {
  if (req.cookies['userID'] === urlDatabase[req.params.id].urlID){
    delete urlDatabase[req.params.id];
    res.redirect('/urls');
  } else {
    res.statusCode = 401;
    res.end("Unauthorized request");
  }
});

app.post("/urls/:id/update", (req,res) => {
  if (req.cookies['userID'] === urlDatabase[req.params.id].urlID){
  urlDatabase[req.params.id].url = req.body.updateURL;
  res.redirect('/urls');
  } else {
    res.statusCode = 401;
    res.end("Unauthorized request");
  }
})



app.listen(PORT, () => {
  console.log(`Tiny URL App listening on port ${PORT}!`);
});