import React from 'react';
import ReactDOM from 'react-dom/client';
import { CourierProvider } from '@trycourier/react-provider';
import './index.css';
import App from './App';

const userId = process.env.REACT_APP_COURIER_USER_ID || 'demo_user';
const jwtToken = process.env.REACT_APP_DEMO_JWT;
const clientKey = process.env.REACT_APP_COURIER_CLIENT_KEY;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Wrap app with CourierProvider for usePreferences hook
// Prefer clientKey (like the example), otherwise use JWT token
root.render(
  <React.StrictMode>
    <CourierProvider
      clientKey={clientKey}
      userId={userId}
      authorization={!clientKey && jwtToken ? jwtToken : undefined}
    >
      <App />
    </CourierProvider>
  </React.StrictMode>
);
