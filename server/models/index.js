var Promise = require('bluebird');
var db = Promise.promisifyAll(require('../db'));

module.exports = {
  messages: {
    get: function () {
      return db.queryAsync(`SELECT Messages.id, Messages.text, Users.username, Rooms.roomname
                            FROM Messages
                            INNER JOIN Users ON Messages.id_Users = Users.id
                            INNER JOIN Rooms ON Messages.id_Rooms = Rooms.id
                            ORDER BY Messages.id_Users DESC;`);
    }, // a function which produces all the messages
    post: function (params) {
      var query = `INSERT INTO Messages (text, id_Users, id_Rooms)
                   VALUES (?, (
                     SELECT id FROM Users WHERE username = ?
                   ), (
                     SELECT id FROM Rooms WHERE roomname = ?
                   ));`;
      var queryParams = [
        params.text,
        params.username,
        params.roomname
      ];
      var formattedQuery = db.format(query, queryParams);
      return db.queryAsync('INSERT IGNORE INTO Users (username) VALUES (?);', [params.username])
      .then((value) => {
        return db.queryAsync('INSERT IGNORE INTO Rooms (roomname) VALUES (?);', [params.roomname]);
      })
      .then((value) => {
        return db.queryAsync(query, queryParams);
      })
      .then(value => {
        return db.queryAsync(`SELECT Messages.id, Messages.text, Users.username, Rooms.roomname, Messages.created_at
                            FROM Messages
                            INNER JOIN Users ON Messages.id_Users = Users.id
                            INNER JOIN Rooms ON Messages.id_Rooms = Rooms.id
                            WHERE Messages.id = ?`, [value.insertId]);
      });
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

