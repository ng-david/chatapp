var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('An IP connected');
  socket.on('disconnect', () => {
    console.log('IP disconnected');
  });
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('name submit', (name) => {
    console.log(name);
  });
});

io.emit('some event', { for: 'everyone' });


http.listen(3000, () => {
  console.log('Listening on *:3000');
});
