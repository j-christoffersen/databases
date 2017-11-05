
var app = {

  //TODO: The current 'handleUsernameClick' function just toggles the class 'friend'
  //to all messages sent by the user
  server: 'http://localhost:3000/classes/messages',
  usernameServer: 'http://localhost:3000/classes/users',
  roomnameServer: 'http://localhost:3000/classes/rooms',
  username: 'anonymous',
  userId: 0,
  roomname: 'lobby',
  roomId: 0,
  lastMessageId: 0,
  friends: {},
  messages: [],
  rooms: [],

  init: function() {
    // Get username
    app.username = window.location.search.substr(10);
    
    //Get the user id
    $.ajax({
      url: app.usernameServer,
      type: 'POST',
      data: JSON.stringify({username: app.username}),
      contentType: 'application/json',
      success: function(data) {
        if (data.insertId) {
          app.userId = data.insertId;
        } else {
          $.ajax({
            url: app.usernameServer,
            type: 'GET',
            data: {username: app.username},
            contentType: 'application/json',
            success: function(data) {
              app.userId = data[0].id;
            },
            error: function(error) {
              console.log('could not get user', error);
            }
          });
        }
      },
      error: function(error) {
        console.log('could not post user', error);
      }
    });
    
    //Get the rooms
    $.ajax({
      url: app.roomnameServer,
      type: 'GET',
      contentType: 'application/json',
      success: function(data) {
        app.rooms = data.map(room => room.roomname);
        app.renderRoomList();
        console.log(app.rooms);
      },
      error: function(error) {
        console.log('could not get rooms', error);
      }
    });

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(function() {
      app.fetch(true);
    }, 3000);
  },

  send: function(message) {
    app.startSpinner();

    // POST the message to the server
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('sent the message', data);
        // Clear messages input
        app.$message.val('');

        // Trigger a fetch to update the messages, pass true to animate
        app.fetch();
      },
      error: function (error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  fetch: function(animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { roomId: app.roomId },
      contentType: 'application/json',
      success: function(data) {
        // Don't bother if we have nothing to work with
        if (!data || !data.length) { return; }
        // Store messages for caching later
        app.messages = data;

        // Get the last message
        var mostRecentMessage = data[data.length - 1];

        // Only bother updating the DOM if we have a new message
        if ( true /* mostRecentMessage.objectId !== app.lastMessageId */ ) {

          // Update the UI with the fetched messages
          app.renderMessages(data, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  clearMessages: function() {
    app.$chats.html('');
  },

  renderMessages: function(messages, animate) {
    // Clear existing messages`
    app.clearMessages();
    app.stopSpinner();
    
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages
        // .filter(function(message) {
        //   return message.roomname === app.roomname ||
        //          app.roomname === 'lobby' && !message.roomname;
        // })
        .forEach(app.renderMessage);
    }

    // Make it scroll to the top
    if (animate) {
      $('body').animate({scrollTop: '0px'}, 'fast');
    }
  },

  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    app.rooms.forEach(roomname => app.renderRoom(roomname));

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

  renderMessage: function(message) {
    
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    // Create a div to hold the chats
    var $chat = $('<div class="chat"/>');

    // Add in the message data using DOM methods to avoid XSS
    // Store the username in the element's data attribute
    var $username = $('<span class="username"/>');
    $username.text(message.username + ': ').attr('data-roomname', message.roomname).attr('data-username', message.username).appendTo($chat);

    // Add the friend class
    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo($chat);

    // Add the message to the UI
    app.$chats.append($chat);

  },

  handleUsernameClick: function(event) {

    // Get username from data attribute
    var username = $(event.target).data('username');

    if (username !== undefined) {
      // Toggle friend
      app.friends[username] = !app.friends[username];

      // Escape the username in case it contains a quote
      var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

      // Add 'friend' CSS class to all of that user's messages
      var $usernames = $(selector).toggleClass('friend');
    }
  },

  handleRoomChange: function(event) {

    var selectIndex = app.$roomSelect.prop('selectedIndex');
    // New room is always the first option
    if (selectIndex === 0) {
      var roomname = prompt('Enter room name');
      if (roomname) {
        // Set as the current room
        app.roomname = roomname;
        
        $.ajax({
          url: app.roomnameServer,
          type: 'POST',
          data: JSON.stringify({roomname: app.roomname}),
          contentType: 'application/json',
          success: function(data) {
            if (data.insertId) {
              app.roomId = data.insertId;
              app.fetch();
              // Add the room to the menu
              app.rooms.push(roomname);
              app.renderRoom(roomname);
              // Select the menu option
              app.$roomSelect.val(roomname);
            } else {
              alert('Room already exists!');
              // Select the menu option
              app.$roomSelect.val(roomname);
              app.handleRoomChange();
            }
          },
          error: function(error) {
            console.log('could not post room', error);
          }
        });
        
      }
    } else {
      app.startSpinner();
      // Store as undefined for empty names
      app.roomname = app.$roomSelect.val();
      $.ajax({
        url: app.roomnameServer,
        type: 'GET',
        data: {roomname: app.roomname},
        contentType: 'application/json',
        success: function(data) {
          app.roomId = data[0].id;
          app.fetch();
        },
        error: function(error) {
          console.log('could not get room', error);
        }
      });
    }
    // Rerender messages
    app.renderMessages(app.messages);
  },

  handleSubmit: function(event) {
    var message = {
      text: app.$message.val(),
      userId: app.userId,
      roomId: app.roomId || 1
    };

    app.send(message);

    // Stop the form from submitting
    event.preventDefault();
  },

  startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};
