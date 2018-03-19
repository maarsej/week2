var getHTML = require('./http-functions');

var requestOptions = {
  host: 'sytantris.github.io',
  path: '/http-examples/step6/lowercase.html'
};

function printHTML (html) {
  var output = html.toLowerCase();
  console.log(output);
}

getHTML(requestOptions, printHTML);