var Promise = require('bluebird');
var db = Promise.promisifyAll(require('../db'));

module.exports = {
  messages: {
    get: function (params) {
      var queryString = `SELECT Messages.id, Messages.text, Users.username, Rooms.roomname, Messages.created_at
                         FROM Messages
                         INNER JOIN Users ON Messages.id_Users = Users.id
                         INNER JOIN Rooms ON Messages.id_Rooms = Rooms.id `;
      var queryParams = [];
      if (params.roomId) {
        queryString += 'WHERE Rooms.id = ? ';
        queryParams.push(params.roomId);
      }
      queryString += 'ORDER BY Messages.created_at DESC;';
      return db.queryAsync(queryString, queryParams);
    }, // a function which produces all the messages
    post: function (params) {
      var query = `INSERT INTO Messages (text, id_Users, id_Rooms)
                   VALUES (?, ?, ?);`;
      var queryParams = [
        params.text,
        params.userId,
        params.roomId
      ];
      var formattedQuery = db.format(query, queryParams);
      
      return db.queryAsync(query, queryParams)
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
    get: function (params) {
      return db.queryAsync('SELECT id FROM Users WHERE username = ?;', [params.username]);
    },
    post: function (params) {
      return db.queryAsync('INSERT IGNORE INTO Users (username) VALUES (?);', [params.username]);
    }
  },
  
  rooms: {
    // Ditto as above.
    get: function (params) {
      if (params.roomname) {
        return db.queryAsync('SELECT id FROM Rooms WHERE roomname = ?;', [params.roomname]);
      } else {
        return db.queryAsync('SELECT * FROM Rooms');
      }
    },
    post: function (params) {
      return db.queryAsync('INSERT IGNORE INTO Rooms (roomname) VALUES (?);', [params.roomname]);
    }
  }
};

