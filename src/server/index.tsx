import path from 'path';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Socket } from 'socket.io';

import paths from '../../config/paths';
import api from './api';

const PORT = process.env.PORT || 8500;

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const sio = require('socket.io')(server);

sio.on('connection', (socket: Socket) => {
  console.log('New client connected');

  socket.on('play', (data) => {
    socket.broadcast.emit('play', data);
  });

  socket.on('pause', (data) => {
    socket.broadcast.emit('pause', data);
  });

  socket.on('change', (data) => {
    socket.broadcast.emit('change', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use(
  paths.publicPath,
  express.static(path.join(paths.clientBuild, paths.publicPath))
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', api);

app.get('/:room', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(paths.clientBuild, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
