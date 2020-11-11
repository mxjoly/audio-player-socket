# 🎵 Music Player Synchronized

This is a tools to synchronized audio tracks on different devices. This uses [Socket.io](https://socket.io/) to allow the clients to communicate in real-time.

## Setup

- ⚛ React 17
- 📦 Webpack 5
- 🔥 TypeScript 4
- ✅ Express 4.x

## Motivation

I teach music in a music school. During the confinement in November 2020 in the Paris region, I had to give my lessons by videoconference. The problem I have been having is with sharing music through Teams, Google Meet or Zoom software. These software provide sound sharing (with the browser or from the computer's sound device) but does not allow real synchronization between users. This media player was therefore created to facilitate the sharing of audio tracks, it is ideal for sharing music because the original sound of the shared files is maintained. Indeed, these files are loaded by the client's browser, and one of the users manages the synchronization.

## Installation

Use `npm install` (or `yarn install`) to install the dependencies. Then `cd` into the project folder and tap `npm start` (or `yarn start`) to run the server.

## Quick Start

```console
yarn build && yarn start
```

## How it works ?

At the home page, complete the form to create a new room. After submitting this form, your room is created and you could invite some people to it by sharing the link with the button at the bottom of the page. Notive that the person which has created the room is the only one that could synchronize his audio player with the guests. He has also a special url with the id of the room followed by a url parameter `admin` set to `true`. When creating a room, you upload some audio files, that will be saved to the server until the next monday throught this room.

The people who clicked on the shared link will be redirect to a form to choose a username. After that, they join the room. In the room, the current active users has displayed at the bottom with their usernames.

The guests could deactivate the synchronization by pressing on the sync button in the audio player. It will display "Synchronisation désactivée" after that.

## Link to the web application

https://music-player-sync.herokuapp.com/

## Licence

[MIT.](https://github.com/mxjoly/music-player-sync/blob/master/LICENSE)
