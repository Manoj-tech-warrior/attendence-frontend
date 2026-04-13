import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth';

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const history = useHistory();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        history.push('/login');
    };

    const closeMenu = () => setMenuOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar__inner">
                <div className="navbar__brand-group">
                    <div>
                        <h1 className="navbar__title">STARK FORCE PVT LTD</h1>
                        <p className="navbar__subtitle">Attendance management for Admin and Employees</p>
                    </div>
                </div>

                <button
                    type="button"
                    className={`nav-toggle ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                >
                    <span>{menuOpen ? '✕' : '☰'}</span>
                </button>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    {user ? (
                        <>
                            <span className="navbar__profile">
                                {user.name ? `${user.name} • ${user.role}` : `${user.role}`}
                            </span>
                            <Link
                                to={user.role === 'Admin' ? '/admin' : '/employee'}
                                className={`navbar__link ${isActive('/admin') || isActive('/employee') ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>
                            {/* ← Profile Link add kiya */}
                            <Link
                                to="/profile"
                                className={`navbar__link ${isActive('/profile') ? 'active' : ''}`}
                                onClick={closeMenu}
                            >
                                👤 Profile
                            </Link>
                            <button onClick={handleLogout} className="nav-button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`navbar__link ${isActive('/login') ? 'active' : ''}`} onClick={closeMenu}>
                                Login
                            </Link>
                            <Link to="/signup" className={`nav-signup ${isActive('/signup') ? 'active' : ''}`} onClick={closeMenu}>
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
