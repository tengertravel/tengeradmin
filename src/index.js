import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserStore } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserStore>
      <App />
    </UserStore>
  </React.StrictMode>
);
