var models = require('../models');

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'application/json'
};

module.exports = {
  messages: {
    get: function (req, res) {
      models.messages.get(req.query)
      .then(function(value) {
        res.writeHead(200, headers);
        res.end(JSON.stringify(value));
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log(req.body);
      models.messages.post(req.body)
      .then(function(value) {
        res.writeHead(201, headers);
        res.end(JSON.stringify(value[0]));
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(req.query)
      .then(function(value) {
        res.writeHead(200, headers);
        res.end(JSON.stringify(value));
      });
    },
    post: function (req, res) {
      models.users.post(req.body)
      .then(function(value) {
        res.writeHead(201, headers);
        res.end(JSON.stringify(value));
      });
    }
  },
  
  rooms: {
    // Ditto as above
    get: function (req, res) {
      models.rooms.get(req.query)
      .then(function(value) {
        res.writeHead(200, headers);
        res.end(JSON.stringify(value));
      });
    },
    post: function (req, res) {
      models.rooms.post(req.body)
      .then(function(value) {
        res.writeHead(201, headers);
        res.end(JSON.stringify(value));
      });
    }
  }
};

