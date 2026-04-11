import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { register } from '../api/authApi';
import { useAuth } from '../utils/auth';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Employee');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            history.replace(user.role === 'Admin' ? '/admin' : '/employee');
        }
    }, [history, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await register({ name, email, password, role });
            setSuccess('Account created successfully. Redirecting to login...');
            setTimeout(() => {
                history.push('/login');
            }, 900);
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err?.message || 'Unable to sign up. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page auth-page--signup">
            <div className="auth-card">
                <header className="auth-card__header">
                    <h2>Create your account</h2>
                    <p>Register and then login to access your attendance dashboard.</p>
                </header>
                {error && <div className="alert alert--error">{error}</div>}
                {success && <div className="alert alert--success">{success}</div>}
                <form onSubmit={handleSubmit} className="auth-form">
                    <label htmlFor="name">Full name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Jane Doe"
                    />
                    <label htmlFor="role">Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Create a password"
                    />
                    <button type="submit" className="button button--primary" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </form>
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;

