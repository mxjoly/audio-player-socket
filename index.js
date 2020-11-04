const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

const public = path.join(process.cwd(), 'public');

const users = [];

app.get('/**', express.static(public));

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});

  socket.on('play', (data) => {
    console.log('play', data);
    socket.broadcast.emit('play', data);
  });

  socket.on('pause', (data) => {
    console.log('pause', data);
    socket.broadcast.emit('pause', data);
  });

  socket.on('change', (data) => {
    console.log('change', data);
    socket.broadcast.emit('change', data);
  });
});

http.listen(PORT, () => {
  console.log('listening on port :', PORT);
});
