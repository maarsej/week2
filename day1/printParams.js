var https = require('https');

var requestOptions = {
    host: 'sytantris.github.io',
    path: '/http-examples/step3.html'
  };

function getAndPrintHTML (options) {



  /* Add your code here */
  https.get(requestOptions, function (response) {
    response.setEncoding('utf8');

    var buffer ="";
    response.on('data', function(chunk){
      buffer += chunk;
    })

    response.on('end', function() {
      console.log(buffer);
    })
  })

}
getAndPrintHTML(requestOptions);