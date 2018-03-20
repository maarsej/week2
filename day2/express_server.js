 /*jshint esversion: 6 */

var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString(){
  return Math.floor((1 + Math.random()) * 0x100000000).toString(36).substring(1);  //random number ==> to any letter/number
}
// for (i = 0; i<20; i++){
//   console.log(generateRandomString());
// }


app.get("/", (req, res) => {
  res.end("Hello! Welcome to tiny URLs, try /urls for some more interesting content");
});

app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
  //res.end("test");
});
app.post("/urls", (req, res) => {
  // console.log(req.body);                // statement to see POST parameters (url given at urls/new)
  let newID = generateRandomString();
  urlDatabase[newID] = req.body.longURL ;
  // console.log(urlDatabase);
  // res.send(`New URL Recieved: ${req.body.longURL} and this is the ID: ${newID}`);         // Respond with 'Ok' (we will replace this)
  res.redirect(`/urls/${newID}`);
});

app.get("/urls/new", (req, res) => { //Takes in new url and redirects to /urls
  res.render("urls_new");
});
app.post("/urls/new", (req, res) => { //Takes in new url and redirects to /urls
  res.render("urls_new");
});



app.get("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, key: req.params.id};   // req.params.id = ':id'
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});
app.post("/urls/:id", (req, res) => {
  let templateVars = { urls: urlDatabase, key: req.params.id};    // req.params.id = ':id'
  // console.log(templateVars);
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // let longURL = ...
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
  let templateVars = { urls: urlDatabase, key: req.params.id};
  res.render("urls_show", templateVars);

});

app.post("/urls/:id/delete", (req,res) => {
  // console.log(urlDatabase);
  delete urlDatabase[req.params.id];
  // console.log(urlDatabase);
  res.redirect('/urls');
});

app.post("/urls/:id/update", (req,res) => {
  urlDatabase[req.params.id] = req.body.updateURL;
  res.redirect('/urls');
})
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Tiny URL App listening on port ${PORT}!`);
});