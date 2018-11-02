/*
* Title: Node.js Master Class Homework Assignment #1
* Description: Creating a "Hello World" API
* Author: Jacob Biehler
* Date: 02/11/2018
*/

// Dependencies
var config = require('./config');
var fs = require('fs');
var http = require('http');
var https = require('https');
var StringDecoder = require('string_decoder').StringDecoder;
var url = require('url');

// Instantiate an HTTP server
var httpServer = http.createServer(function (req, res) {
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
  console.log('The server is listening on port ' + config.httpPort + ' for HTTP requests');
});

// Instantiate an HTTPS server
var httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
  console.log('The server is listening on port ' + config.httpsPort + ' for HTTPS requests');
});

var unifiedServer = function (req, res) {
  // Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  // Get the path from that URL
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Getting the payload if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    // Choose the handler the request should go to. If one is not found use the notFound handler
    var chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': parsedUrl.query,
      'method': req.method.toLowerCase(),
      'headers': req.headers,
      'payload': buffer
    };

    // Route the request to the handler specified
    chosenHandler(data, function (statusCode, payload) {
      // Use the status code called back by the handler or default to 200
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200;

      // Use the payload called back by the handler or default to an empty object
      payload = typeof (payload) === 'object' ? payload : {};

      // Convert payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      // Logging a message to the user
      console.log('Welcome to my Hello World API written in Node. Here is the response: ', statusCode, payloadString);
    });
  });
};

// Defining the handlers
var handlers = {};

// Hello handler
handlers.hello = function (data, callback) {
  callback(200, {'name':'hello'});
};

// Not Found handler
handlers.notFound = function (data, callback) {
  callback(404, {'name':'route not valid'});
};

// Defining a request router
var router = {
  'hello': handlers.hello
};
