import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { getUser } from '../utils/auth';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');

    // Password form
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const user = getUser();
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await apiClient.get('/users/me');
                setProfile(res.data);
                setName(res.data.name || '');
                setPhone(res.data.phone || '');
                setDepartment(res.data.department || '');

                if (isAdmin) {
                    const usersRes = await apiClient.get('/users');
                    setAllUsers(usersRes.data);
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [isAdmin]);

    const handleProfileUpdate = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.put('/users/me', { name, phone, department });
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await apiClient.put('/users/me/change-password', { oldPassword, newPassword });
            setSuccess('Password changed successfully!');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err?.data?.message || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await apiClient.put(`/users/${userId}/role`, { role: newRole });
            setAllUsers(prev => prev.map(u =>
                u._id === userId ? { ...u, role: newRole } : u
            ));
            setSuccess('Role updated successfully!');
        } catch (err) {
            setError('Failed to update role');
        }
    };

    if (loading) return <div className="page-loader">Loading profile...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">{isAdmin ? 'Admin' : 'Employee'} Profile</p>
                    <h1>My Profile</h1>
                    <p className="dashboard-copy">Manage your account details and settings.</p>
                </div>
            </div>

            {error && <div className="alert alert--error">{error}</div>}
            {success && <div className="alert alert--success">{success}</div>}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('profile')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: activeTab === 'profile' ? '#3B82F6' : '#F3F4F6',
                        color: activeTab === 'profile' ? 'white' : '#374151',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    👤 Profile
                </button>
                <button
                    onClick={() => setActiveTab('password')}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: activeTab === 'password' ? '#3B82F6' : '#F3F4F6',
                        color: activeTab === 'password' ? 'white' : '#374151',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    🔑 Change Password
                </button>
                {isAdmin && (
                    <button
                        onClick={() => setActiveTab('employees')}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'employees' ? '#3B82F6' : '#F3F4F6',
                            color: activeTab === 'employees' ? 'white' : '#374151',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        👥 Employees
                    </button>
                )}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="dashboard-section" style={{ maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email</label>
                            <input
                                type="text"
                                value={profile?.email || ''}
                                disabled
                                className="input-field"
                                style={{ width: '100%', backgroundColor: '#F3F4F6', cursor: 'not-allowed' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Department</label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                                placeholder="Enter department"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Role</label>
                            <input
                                type="text"
                                value={profile?.role || ''}
                                disabled
                                className="input-field"
                                style={{ width: '100%', backgroundColor: '#F3F4F6', cursor: 'not-allowed' }}
                            />
                        </div>
                        <button
                            onClick={handleProfileUpdate}
                            disabled={saving}
                            style={{
                                backgroundColor: saving ? '#9CA3AF' : '#22C55E',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                width: '100%'
                            }}
                        >
                            {saving ? '⏳ Saving...' : '✅ Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="dashboard-section" style={{ maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                                placeholder="Enter old password"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                style={{ width: '100%' }}
                                placeholder="Confirm new password"
                            />
                        </div>
                        <button
                            onClick={handlePasswordChange}
                            disabled={saving}
                            style={{
                                backgroundColor: saving ? '#9CA3AF' : '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                width: '100%'
                            }}
                        >
                            {saving ? '⏳ Saving...' : '🔑 Change Password'}
                        </button>
                    </div>
                </div>
            )}

            {/* Employees Tab — Admin Only */}
            {activeTab === 'employees' && isAdmin && (
                <div className="dashboard-section">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#F3F4F6' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                                    <td style={{ padding: '12px' }}>{u.name}</td>
                                    <td style={{ padding: '12px' }}>{u.email}</td>
                                    <td style={{ padding: '12px' }}>{u.role}</td>
                                    <td style={{ padding: '12px' }}>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Employee">Employee</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
