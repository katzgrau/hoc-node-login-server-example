// We're using a special library for handling connections called restify - google it
var restify = require('restify');

// first we create a server
var server = restify.createServer({
  name: 'Node login server example',
  version: '1.0.0'
});

// then we do some configuration. for example, the last line
// will allow browsers to attempt to make login calls from
// anywhere on the internet
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

// This is the default response when you open the site url in your browser
server.get('/', function (req, res, next) {
  res.send('Oh hey. Connect to /login if you want to try and log in');
  return next();
});

// This isn't something you'd have in real life, just for example purposes
// Normally users would be stored in a database, and the passwords would be
// encrypted
var usersTable = {
  // format is username: password
  admin: 'admin123',
  jenkins: 'password'
}

// This is the login call. You can't get to it by opening a browser to /login
// because browsers by default make requests called GET requests. Login calls
// should generally always take place over POST requests. They're almost the same
// thing, but the data being passed to the server is sent in a different way 
server.post('/login', function (req, res, next) {
  // first, make sure whoever is logging in sent both the username and password
  if (req.body.username && req.body.password) {
    // if they did, check that the username and password matches a user
    if (usersTable[req.body.username] == req.body.password) {
      // nice, successful login, send back a message
      res.send({success: true, message: 'Login successful', username: req.body.username}); 
    } else {
      // unsuccessful login. we send back the http 422 status because it's good
      // practice (not really required) with a message
      res.status(422)
      res.send({success: false, message: 'Login unsuccessful'});
    }
  } else {
    // if we got here, the user didn't send a username or password
    // we send back the 400 status code (standard, best practice, not required)
    // and send a successful status message
    res.status(400)
    res.send({success: false, message: 'You must send both a username and password'});
  }
  return next();
});

// We "listen" for connections on "port" 3001. Every computer has 2^16 (65,535)
// ports. Think of a port as a door you can knock on, which might or might not
// open. Applications like Skype, Spotify, Chrome, all send data and receieve
// data through these ports. Keep in mind, ports are totally conceptual  
server.listen(process.env.PORT || 3001, function () {
  console.log('%s listening at %s', server.name, server.url);
});