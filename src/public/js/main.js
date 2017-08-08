// Main
$(function() {
  let socket, isLoggedIn;

  // Initialize io
  socket = io();

  // Login Form
  $('#login').submit(function() {
    const name = $('#name').val();
    const lang = $('input:radio[name=lang]:checked').val();
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
      socket.emit('login', { name: name, lang: lang });
      $('#m').focus();
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
    $('#messages').append($('<li class="msg-line">').text(msg));
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
  });

  socket.on('user list', function(users) {

    const count = Object.keys(users).length;
    $('#activeCount').text(count);

    $('#activeUsers').empty();
    for (const id in users) {
      const name = users[id].name;
      $('#activeUsers').append($('<li class="name">').text(name));
    }
  });
});
