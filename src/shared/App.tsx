import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import './App.scss';
import { useSocket } from '../client/socket';

const Header = React.lazy(() => import('./components/structure/Header'));
const Content = React.lazy(() => import('./components/structure/Content'));
const Footer = React.lazy(() => import('./components/structure/Footer'));

function App() {
  const socketClient = useSocket();

  useEffect(() => {
    if (socketClient) {
      socketClient.on('connection', () => {
        console.log('Connected to the server');
      });
      return () => socketClient.disconnect();
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <html lang="fr-FR" />
        <link rel="icon" href="/logo.png" />
        <meta
          name="description"
          content="An application to synchronize a track with many devices."
        />
      </Helmet>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default React.memo(App);
