import React from 'react';
import { useAuth } from '../utils/auth';

const SessionWarning = () => {
  const { sessionWarning, extendSession, logout } = useAuth();

  if (!sessionWarning) return null;

  return (
    <div className="session-warning">
      <div className="session-warning-content">
        <div className="warning-icon">â°</div>
        <div className="warning-text">
          <h4>Session Expiring Soon</h4>
          <p>Your session will expire in less than 5 minutes. Please save your work.</p>
        </div>
        <div className="warning-actions">
          <button
            className="button button--primary"
            onClick={extendSession}
          >
            Stay Logged In
          </button>
          <button
            className="button button--secondary"
            onClick={logout}
          >
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;
