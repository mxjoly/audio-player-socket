import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';

import App from '../shared/App';
import './_reset.scss';
import { SocketProvider } from './socket';
import alertTemplate from './alert';
import reportWebVitals from './reportWebVitals';

const render = module.hot ? ReactDOM.render : ReactDOM.hydrate;

render(
  <Suspense fallback={null}>
    <React.StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <SocketProvider>
            <AlertProvider
              template={alertTemplate}
              position={positions.BOTTOM_CENTER}
              transition={transitions.FADE}
              timeout={5000}
            >
              <App />
            </AlertProvider>
          </SocketProvider>
        </HelmetProvider>
      </BrowserRouter>
    </React.StrictMode>
  </Suspense>,
  document.getElementById('app')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept();
  }
}
