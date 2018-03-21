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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  }
}

function generateRandomString(){
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);  //random number ==> to any letter/number
}

function emailCheck(email) {
  for (let user in users) {
    return (Object.values(users[user]).indexOf(email)>-1);
  }
};
// for (i = 0; i<20; i++){
//   console.log(generateRandomString());


app.get("/", (req, res) => {
  res.end("Hello! Welcome to tiny URLs, try /urls for some more interesting content");
});

app.get("/urls", (req, res) => {
  let templateVars = { username: req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_index", templateVars);
});
app.post("/urls", (req, res) => {
  let newID = generateRandomString();
  let check = true;
  while (check === true){
    if (urlDatabase[newID] !== undefined) {
      let newID = generateRandomString();
    } else {
      urlDatabase[newID] = req.body.longURL ;
      check = false;
    }
  }
  res.redirect(`/urls/${newID}`);
});

app.get("/urls/new", (req, res) => {
  var templateVars = { username: req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_new", templateVars);
});
app.post("/urls/new", (req, res) => {
 let templateVars = { username: req.cookies["username"],
 urls: urlDatabase, key: req.params.id};
 res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { username: req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  let templateVars = { username:req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  if (urlDatabase[req.params.shortURL] === undefined) {
    res.statusCode = 404;
    console.log(res.statusCode);
    res.end("Unknown Path");
  } else {
    res.statusCode = 301;
    console.log(res.statusCode);
    res.redirect(`/longURL/${req.params.shortURL}`);
  }
});

app.get("/longURL/:id", (req,res) => {
  let templateVars = { username:req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);

});

app.get("/register", (req,res) => {
  let templateVars = { username:req.cookies["username"],
  urls: urlDatabase, key: req.params.id};
  res.render("urls_register", templateVars);
});

app.post("/register", (req,res) => {
  // store user data
  if (req.body.email === '' || req.body.id === '' || req.body.password === ''){
    res.statusCode = 400;
    res.end("empty registration field");
  } else if (emailCheck(req.body.email)) {
    res.statusCode = 400;
    res.end("Email already in use");
  } else {
  users[req.body.id]= { id : req.body.id,
                        email: req.body.email,
                        password: req.body.password
                      };
  console.log(users);
  // add user_ID to cookie
  res.cookie('userID', req.body.id);
  }
  //redirect to front page
  res.redirect("/urls")
});

app.post("/urls/:id/delete", (req,res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

app.post("/urls/:id/update", (req,res) => {
  urlDatabase[req.params.id] = req.body.updateURL;
  res.redirect('/urls');
})

app.post("/login", (req,res) => {
  res.cookie('username', req.body.username);
  res.redirect('urls');
});

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect('urls');
})


app.listen(PORT, () => {
  console.log(`Tiny URL App listening on port ${PORT}!`);
});