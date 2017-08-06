const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exphbs = require('express-handlebars');

// Setup App
app.use(express.static(path.join(__dirname, 'public')))
// Set up views + view engine to be handlebars
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  defaultLayout: 'main',
}));

// Run Server
http.listen(3000, () => {
  console.log('Listening on *:3000');
});

// Global Variables
let connections = 0;
let users = {};

// Initial get
app.get('/', (req, res) => {
  res.render('chat');
});

// When a user connects to app
io.on('connection', (socket) => {
  let id = getNewId();
  let name = null;

  // User Connect
  console.log(`NEW Connection (ID: ${id})`);

  // User Disconnect
  socket.on('disconnect', () => {
    delete users[id];
    console.log(`EHD Connection for '${name}' (ID: ${id})`);
    io.emit('chat message', `${name} left the chat.`)
    io.emit('user list', users);
  });

  // Name Chosen
  socket.on('name submit', (userName) => {
    name = userName;
    users[id] = { "name": userName }; // Add to database
    console.log(`${id} entered name '${name}'`);
    io.emit('chat message', `${name} joined the chat.`)
    io.emit('user list', users);
  });

  // Chat Submitted
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${name}: ${msg}`);
  });



});

// Helper functions
function getNewId() {
  return ++connections;
}
