import React, { useEffect, useState } from 'react';
import { addAttendanceRecord, updateAttendanceRecord } from '../api/attendanceApi';

const AdminAttendanceForm = ({ onClose, onSuccess, record, employees }) => {
    const [formData, setFormData] = useState({
        userId: '',
        date: '',
        status: 'Present',
        dayType: 'Working',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (record) {
            setFormData({
                userId: typeof record.userId === 'object' ? record.userId._id : record.userId,
                date: record.date.split('T')[0],
                status: record.status,
                dayType: record.dayType,
            });
        }
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (record) {
                await updateAttendanceRecord(record._id, formData);
            } else {
                await addAttendanceRecord(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err?.message || 'Error saving attendance record');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content admin-form-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{record ? 'Edit Attendance' : 'Add Attendance'}</h2>
                    <button className="close-btn" onClick={onClose}>Ã—</button>
                </div>

                {error && <div className="alert alert--error">{error}</div>}

                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label htmlFor="userId">Employee</label>
                        <select
                            id="userId"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            required
                            disabled={!!record}
                        >
                            <option value="">Select Employee</option>
                            {employees?.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name} ({emp.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Weekly Off">Weekly Off</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dayType">Day Type</label>
                        <select
                            id="dayType"
                            name="dayType"
                            value={formData.dayType}
                            onChange={handleChange}
                        >
                            <option value="Working">Working</option>
                            <option value="Weekend">Weekend</option>
                            <option value="Holiday">Holiday</option>
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="button button--secondary" onClick={onClose} disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="button button--primary" disabled={loading}>
                            {loading ? 'Saving...' : record ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAttendanceForm;

