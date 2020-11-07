import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Socket } from 'socket.io';
import axios from 'axios';
import './App.scss';

import Header from './components/structure/Header';
import Content from './components/structure/Content';
import Footer from './components/structure/Footer';
import MediaPlayer from './components/organisms/MediaPlayer';

const socketIOClient = require('socket.io-client');

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    const socketClient = socketIOClient(process.env.HOST);
    socketClient.on('connection', () => {
      console.log('Connected to the server');
    });

    axios({
      method: 'get',
      url: `${process.env.HOST}/api/musics`,
    })
      .then((res) => {
        // @ts-ignore
        setSources(res.data.musics.sort());
        setSocket(socketClient);
      })
      .catch((err) => {
        console.error(err);
      });

    // CLEAN UP THE EFFECT
    return () => socketClient.disconnect();
  }, []);

  if (!socket) {
    return <div />;
  }

  return (
    <div className="App">
      <Helmet
        defaultTitle="Formation Musicale"
        titleTemplate="%s – Media Player"
      >
        <html lang={'fr-FR'} />
        <link rel="icon" href="/logo.png" />
        <meta
          name="description"
          content="An application to synchronize a track with some devices."
        />
      </Helmet>
      <Header />
      <Content>
        <MediaPlayer sources={sources} socket={socket} />
      </Content>
      <Footer />
    </div>
  );
}

export default App;
