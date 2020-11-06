# Music Player Synchronized

This is a tools using to play a music track on different devices. This uses [Node.js](https://nodejs.org/en/) and [Socket.io](https://socket.io/) to allow the clients to communicate in real-time.

## The motivation

I teach music in a music school. During the confinement in November 2020 in the Paris region, I had to give my lessons by videoconference. The problem I have been having is with sharing music through Teams, Google Meet or Zoom software. These software provide sound sharing (with the browser or from the computer's sound device) but does not allow real synchronization between users. This media player was therefore created to facilitate the sharing of audio tracks, it is ideal for sharing music because the original sound of the shared files is maintained. Indeed, these files are loaded by the client's browser, and one of the users manages the synchronization.

## Installation

Use `npm install` (or `yarn install`) to install the dependencies. Then `cd` into the project folder and tap `npm start` (or `yarn start`) to run the server.

## Quick Start

```console
yarn build && yarn start
```

## Licence

[MIT.](https://github.com/mxjoly/music-player-sync/blob/master/LICENSE)
