import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../utils/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const { login: authLogin } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login({ email, password });
            authLogin(response.token);
            const role = response.user?.role;
            history.push(
                role === 'Admin' ? '/admin' : role === 'Employee' ? '/employee' : '/login'
            );
        } catch (err) {
            setError(err?.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="auth-page auth-page--login">
            <div className="auth-card">
                <header className="auth-card__header">
                    <h2>Welcome back</h2>
                   
                    <p>Sign in to manage attendance and view your dashboard.</p>
                </header>
                {error && <div className="alert alert--error">{error}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                    />
                    <button type="submit" className="button button--primary">Login</button>
                </form>
                <p className="auth-footer">
                    New here? <Link to="/signup">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
