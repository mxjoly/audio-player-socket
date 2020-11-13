import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import { Socket } from 'socket.io';

import paths from '../../config/paths';
import api from './api';
import { getRoom, findUser } from './room';

const PORT = process.env.PORT || 8500;
const UPLOAD_SIZE_LIMITS = 8 * 1024 * 1024; // 8 MB

// Environment variable
require('dotenv').config();

// Tasks
require('./tasks');

const app = express();
const server = http.createServer(app);
const sio = require('socket.io')(server);

sio.on('connection', (socket: Socket) => {
  socket.on('join_room', ({ roomId, username }) => {
    const room = getRoom(roomId);
    if (room) {
      const hasFreePlace = room.size - room.users.length > 0;
      if (hasFreePlace) {
        socket.join(roomId);
        room.addUser(username, socket.id);
        console.log(`[${username}] joins the room [${roomId}]`);
        // send message including sender
        sio.in(roomId).emit('join_room', room.users);
      } else {
        console.log(
          `[${username}] cannot join the room ${roomId} because there is no more place`
        );
      }
    }
  });

  socket.on('play_audio', ({ trackId, time, roomId }) => {
    // True if the room exists, false otherwise
    if (Array.from(socket.rooms).indexOf(roomId) > -1) {
      socket.to(roomId).emit('play_audio', { trackId, time });
    }
  });

  socket.on('pause_audio', ({ trackId, time, roomId }) => {
    if (Array.from(socket.rooms).indexOf(roomId) > -1) {
      socket.to(roomId).emit('pause_audio', { trackId, time });
    }
  });

  socket.on('volume_change', ({ volume, roomId }) => {
    if (Array.from(socket.rooms).indexOf(roomId) > -1) {
      socket.to(roomId).emit('volume_change', volume);
    }
  });

  socket.on('disconnect', () => {
    const user = findUser(socket.id);
    if (user) {
      socket.leave(user.room.id);
      user.room.removeUser(user.id);
      console.log(`[${user.name}] leaves the room [${user.room.id}]`);
      socket.to(user.room.id).emit('leave_room', user.room.users);
    }
  });
});

app.use(
  paths.publicPath,
  express.static(path.join(paths.clientBuild, paths.publicPath))
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  fileUpload({
    limits: { fileSize: UPLOAD_SIZE_LIMITS },
  })
);

app.use('/api', api);

app.get('*', (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(paths.clientBuild, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
