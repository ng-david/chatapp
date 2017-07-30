const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let connections = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// When a user connects to app
io.on('connection', (socket) => {
  let id = getNewId();
  let name = null;

  // User Connect
  console.log(`NEW Connection (ID: ${id})`);

  // User Disconnect
  socket.on('disconnect', () => {
    console.log(`EHD Connection for ${name} (ID: ${id})`);
  });

  // Name Chosen
  socket.on('name submit', (userName) => {
    name = userName;
    console.log(`${id} entered name ${name}`);
  });

  // Chat Submitted
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${name}: ${msg}`);
  });

});

io.emit('some event', { for: 'everyone' });


http.listen(3000, () => {
  console.log('Listening on *:3000');
});

function getNewId() {
  return ++connections;
}
