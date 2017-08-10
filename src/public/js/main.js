// Main
$(function() {
  let socket, isLoggedIn, id, lastMsgId;

  // Initialize io
  socket = io();
  // Receive id
  socket.on('id', function(givenId) {
    id = givenId;
  });

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
  socket.on('chat message', function(msgData) {
    // If sender is this client && last msg was from same person
    if (msgData.id === id && lastMsgId === msgData.id) {
      $('#messages').append($('<li class="my-msg">').html(
        "<div class=\"\">"
        + msgData.msg +
        "</div><div class=\"\">"
        + msgData.tMsg +
        "</div>"
      )).append($('<div style=\"clear:both\">'));
    // Else if sender is client
    } else if (msgData.id === id) {
      $('#messages').append($('<li class="my-msg">').html(
        "<span class=\"name\">"
        + msgData.name +
        "</span><div class=\"\">"
        + msgData.msg +
        "</div><div class=\"\">"
        + msgData.tMsg +
        "</div>"
      )).append($('<div style=\"clear:both\">'));
    // Else if sender not client && last msg was from same person
    } else if (lastMsgId === msgData.id) {
      $('#messages').append($('<li class="their-msg">').html(
        "<div class=\"\">"
        + msgData.msg +
        "</div><div class=\"\">"
        + msgData.tMsg +
        "</div>"
      )).append($('<div style=\"clear:both\">'));
    } else {
      $('#messages').append($('<li class="their-msg">').html(
        "<span class=\"name\">"
        + msgData.name +
        "</span><div class=\"\">"
        + msgData.msg +
        "</div><div class=\"\">"
        + msgData.tMsg +
        "</div>"
      )).append($('<div style=\"clear:both\">'));
    }
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
    lastMsgId = msgData.id;
  });

  socket.on('login msg', function(msg) {
    $('#messages').append($('<li class="login-msg">').text(msg));
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
