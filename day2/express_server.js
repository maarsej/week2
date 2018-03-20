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
for (i = 0; i<20; i++){
  console.log(generateRandomString());
}


app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls", (req, res) => {
  var templateVars = { urls: urlDatabase };
  res.render("urls_index", {templateVars});
  //res.end("test");
});

app.get("/urls/new", (req, res) => { //Takes in new url and redirects to /urls
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);                // statement to see POST parameters
  res.send("New URL Recieved");         // Respond with 'Ok' (we will replace this)
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", { templateVars: templateVars});

});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});