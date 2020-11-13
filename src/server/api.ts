import express from 'express';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';

import paths from '../../config/paths';
import Room, { rooms, getRoom, deleteRoom } from './room';

const api = express.Router();

api.get('/load/:roomId', (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = getRoom(roomId);
    if (room) {
      if (room.size - room.users.length > 0) {
        console.log(`Load successfully the room [${roomId}]`);
        res.status(200).json({
          roomName: room.name,
          roomSize: room.size,
          roomAdmin: room.admin,
          musics: room.musics,
        });
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

api.post('/create/:roomId', (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { roomName, roomSize, roomAdmin } = req.body;

    if (!roomName || !roomSize || !roomAdmin) {
      res.sendStatus(400);
    }

    const files: UploadedFile[] = req.files;
    const roomResolvePath = `${paths.clientBuild}/${paths.publicAssets}/${roomId}`;

    const createFiles = () => {
      Object.values(files)
        .filter(
          (file) => file.mimetype.startsWith('audio/') // The file must be a music file
        )
        .forEach((file) => {
          fs.writeFileSync(`${roomResolvePath}/${file.name}`, file.data);
        });
    };

    const getFilenames = () => {
      return Object.values(files).map((file) => file.name);
    };

    if (files) {
      if (!fs.existsSync(roomResolvePath)) {
        fs.promises.mkdir(roomResolvePath, { recursive: true }).then(() => {
          createFiles();
        });
      } else {
        createFiles();
      }

      const musics = getFilenames().map((music) => ({
        name: music.slice(0, music.lastIndexOf('.')),
        url: `/${paths.publicAssets}/${roomId}/${music}`,
      }));
      rooms.push(
        new Room(roomId, roomName, Number(roomSize), roomAdmin, musics)
      );
      console.log(`The room [${roomId}] has been created successfully`);
      res.status(200).json({ roomName, roomSize, roomAdmin, musics });
    } else {
      // Cannot create a room without any musics
      res.sendStatus(400);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

api.post('/delete/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const room = getRoom(roomId);
  const roomResolvePath = `${paths.clientBuild}/${paths.publicAssets}/${roomId}`;

  if (room && fs.existsSync(roomResolvePath)) {
    fs.rmdir(roomResolvePath, (err) => {
      if (err) {
        console.error(err);
        res.status(400).send(err);
      } else {
        deleteRoom(roomId);
        console.log(`The room [${roomId}] has been deleted successfully`);
        res.sendStatus(200);
      }
    });
  } else {
    console.log(`The room [${roomId}] has been not found`);
    res.sendStatus(200);
  }
});

export default api;
