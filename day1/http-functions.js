module.exports = function getHTML (options, callback) {
    /* Your code here */
    var https = require('https');

    https.get(options, function (response) {
    response.setEncoding('utf8');

    var buffer ="";
    response.on('data', function(chunk){
      buffer += chunk;
    })

    response.on('end', function() {
      callback(buffer);
    })
  })
};