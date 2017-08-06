// Main
$(function() {
  // Initialize io
  const socket = io();

  // Get user's name
  let name = null;
  while (name === null || name === "") {
    name = prompt("Please enter your name:");
  }
  socket.emit('name submit', name);

  // When form is submitted, clear it and emit the message
  $('form').submit(function() {
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
  });
  // When chat message received, append to box
  socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));
  });
});
