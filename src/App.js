import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './utils/auth';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <NavBar />
      <Switch>
        <Route path={["/", "/login"]} exact>
          {user ? <Redirect to={user.role === 'Admin' ? '/admin' : '/employee'} /> : <LoginPage />}
        </Route>

        <Route path="/signup" exact>
          {user ? <Redirect to={user.role === 'Admin' ? '/admin' : '/employee'} /> : <SignupPage />}
        </Route>

        <ProtectedRoute path="/admin" exact component={AdminDashboard} allowedRoles={['Admin']} />
        <ProtectedRoute path="/employee" exact component={EmployeeDashboard} allowedRoles={['Employee']} />
        
        {/* ← Yeh add kiya */}
        <ProtectedRoute path="/profile" exact component={ProfilePage} allowedRoles={['Admin', 'Employee']} />

        <Route path="*">
          <Redirect to={user ? (user.role === 'Admin' ? '/admin' : '/employee') : '/login'} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
