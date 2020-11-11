import fs from 'fs';
import nodeSchedule from 'node-schedule';
import paths from '../../config/paths';
import { clearRoom } from './room';

const getDirectories = (source: string) => {
  return fs
    .readdirSync(source, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name);
};

// Every monday at 00:00:00, the resources created for the rooms are deleted
nodeSchedule.scheduleJob('0 0 * * 1', () => {
  const roomsId = getDirectories(`${paths.clientBuild}/assets`);
  roomsId.forEach((roomId) => {
    fs.rmdir(
      `${paths.clientBuild}/assets/${roomId}`,
      { recursive: true },
      (err) => {
        if (err) console.error(`The room ${roomId} cannot be deleted`);
        else console.error(`The room ${roomId} has been deleted successfully`);
      }
    );
  });
  clearRoom();
});
