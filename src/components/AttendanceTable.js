import React from 'react';

const AttendanceTable = ({ records, userRole, onEdit, onDelete }) => {
    const resolveEmployeeName = (userId) => {
        if (!userId) return 'Unknown';
        if (typeof userId === 'object') {
            return userId.name || userId.email || userId._id || 'Unknown';
        }
        return userId;
    };

    return (
        <div className="table-wrapper">
            {records.length === 0 ? (
                <div className="empty-state">No attendance records available.</div>
            ) : (
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                            {userRole === 'Admin' && <th>Employee</th>}
                            {userRole === 'Admin' && <th>Day Type</th>}
                            {userRole === 'Admin' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record) => (
                            <tr key={record._id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td>
                                    <span className={`status-badge status-badge--${record.status?.toLowerCase().replace(' ', '-')}`}>
                                        {record.status}
                                    </span>
                                </td>
                                {userRole === 'Admin' && (
                                    <td>{resolveEmployeeName(record.userId)}</td>
                                )}
                                {userRole === 'Admin' && (
                                    <td>{record.dayType || 'Working'}</td>
                                )}
                                {userRole === 'Admin' && (
                                    <td>
                                        <div className="action-buttons">
                                            {onEdit && (
                                                <button
                                                    className="btn-icon btn-icon--edit"
                                                    onClick={() => onEdit(record)}
                                                    title="Edit"
                                                >
                                                    âœï¸
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    className="btn-icon btn-icon--delete"
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this record?')) {
                                                            onDelete(record._id);
                                                        }
                                                    }}
                                                    title="Delete"
                                                >
                                                    ðŸ—‘ï¸
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AttendanceTable;
