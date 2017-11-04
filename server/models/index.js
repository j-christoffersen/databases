var Promise = require('bluebird');
var db = Promise.promisifyAll(require('../db'));

module.exports = {
  messages: {
    get: function () {
      return db.queryAsync('SELECT * FROM Messages');
    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

