
// Main
$(function() {
  let socket, isLoggedIn;

  // Initialize io
  socket = io();

  // Login Form
  $('#nameInput').submit(function() {
    const name = $('#name').val();
    const err = $('#err');
    const modal = $('#loginModal');
    const overlay = $('#overlay');

    if (!name) {
      err.css("display", "block");
    } else {
      isLoggedIn = true;
      err.css("display", "none");
      modal.css("display", "none");
      overlay.css("display", "none");
      socket.emit('name submit', name);
    }
    // Prevent page reload
    return false;
  });

  // Chat Form
  // When chat is submitted, clear it and emit the message
  $('#chatInput').submit(function() {
    const msg = $('#m').val();
    if (isLoggedIn) {
      if (msg !== "") {
        socket.emit('chat message', msg);
        $('#m').val('');
      }
      return false;
    }
    // Cause page reload of user not logged in
    return true;
  });

  // When chat message received, append to box
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });

  socket.on('user list', function(list) {
    $('#activeUsers').empty();
    for (id in list) {
      const name = list[id].name;
      $('#activeUsers').append($('<li>').text(name));
    }
  });

});
