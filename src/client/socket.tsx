import React from 'react';

let socketClient: any = null;

if (process.env.NODE_ENV === 'production') {
  const socketIOClient = require('socket.io-client');
  socketClient = socketIOClient(process.env.HOST);
  socketClient.on('connection', () => {
    console.log('Connected to the server');
  });
}

const SocketContext = React.createContext(socketClient);

export const SocketProvider = (props: any) => {
  return (
    <SocketContext.Provider value={socketClient}>
      {props.children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return socketClient;
};
