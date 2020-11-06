import express from 'express';
import fs from 'fs';
import path from 'path';

import paths from '../../config/paths';

const api = express.Router();

api.get('/musics', (req, res) => {
  const musics = fs
    .readdirSync(paths.musics, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name)
    .filter((item) => path.extname(item).match(/(mp3|ogg|aif|wav)/));

  res.status(200).json({ musics });
});

export default api;
