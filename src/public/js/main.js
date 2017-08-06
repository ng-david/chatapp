
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
    // If there isnt a name, this will return true and therefore reload the page to bring up the modal again
    if (isLoggedIn) {
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
    }
    return true;
  });
  // When chat message received, append to box
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
});
