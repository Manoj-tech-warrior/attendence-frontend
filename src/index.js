import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './utils/auth';
import './index.css';

// âœ… process fix (important)
window.process = {
  env: {},
};

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
