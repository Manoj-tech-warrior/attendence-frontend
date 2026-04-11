import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const ProtectedRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user) {
          return <Redirect to="/login" />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
          return <Redirect to={user.role === 'Admin' ? '/admin' : '/login'} />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;

