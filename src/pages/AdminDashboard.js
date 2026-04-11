import { useHistory } from 'react-router-dom';
import AttendanceTable from '../components/AttendanceTable';
import AdminAttendanceForm from '../components/AdminAttendanceForm';
import { fetchAttendanceRecords, deleteAttendanceRecord } from '../api/attendanceApi';
import React, { useEffect, useMemo, useState } from 'react';
import { getUserRole } from '../utils/auth';

const AdminDashboard = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filterDate, setFilterDate] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const history = useHistory();

    useEffect(() => {
        const role = getUserRole();
        if (role !== 'Admin') {
            history.push('/login');
            return;
        }

        const fetchRecords = async () => {
            setLoading(true);
            setError('');

            try {
                const records = await fetchAttendanceRecords(filterDate || undefined, filterMonth || undefined);
                setAttendanceRecords(records);

                // Extract unique employees
                const empSet = new Map();
                records.forEach(record => {
                    if (record.userId && typeof record.userId === 'object') {
                        empSet.set(record.userId._id, record.userId);
                    }
                });
                setEmployees(Array.from(empSet.values()));
            } catch (err) {
                setError(err?.message || 'Unable to load attendance records.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [filterDate, filterMonth, history]);

    const summary = useMemo(() => {
        const totalRecords = attendanceRecords.length;
        const presentCount = attendanceRecords.filter((record) => record.status === 'Present').length;
        const absentCount = attendanceRecords.filter((record) => record.status === 'Absent').length;
        const weekendCount = attendanceRecords.filter((record) => record.status === 'Weekly Off').length;
        const uniqueEmployees = new Set(
            attendanceRecords
                .map((record) => {
                    if (!record.userId) return null;
                    return typeof record.userId === 'object'
                        ? record.userId._id || record.userId.id
                        : record.userId;
                })
                .filter(Boolean)
        ).size;

        return {
            totalRecords,
            presentCount,
            absentCount,
            weekendCount,
            uniqueEmployees,
        };
    }, [attendanceRecords]);

    const handleAdd = () => {
        setEditingRecord(null);
        setShowForm(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteAttendanceRecord(id);
            setAttendanceRecords(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            setError(err?.message || 'Error deleting record');
        }
    };

    const handleFormSuccess = async () => {
        setShowForm(false);
        setEditingRecord(null);
        // Reload records
        try {
            const records = await fetchAttendanceRecords(filterDate || undefined, filterMonth || undefined);
            setAttendanceRecords(records);
        } catch (err) {
            setError(err?.message || 'Error reloading records');
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Admin Dashboard</p>
                    <h1>Attendance Management</h1>
                    <p className="dashboard-copy">Monitor employee attendance, manage records, and review daily status.</p>
                </div>
            </div>

            {error && <div className="alert alert--error">{error}</div>}

            {/* Filters and Add Button */}
            <div className="admin-controls">
                <div className="filter-row">
                    <div className="filter-group">
                        <label htmlFor="filter-month">Filter by month</label>
                        <input
                            id="filter-month"
                            type="month"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="filter-group">
                        <label htmlFor="filter-date">Filter by date</label>
                        <input
                            id="filter-date"
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    {(filterMonth || filterDate) && (
                        <button
                            className="button button--secondary"
                            onClick={() => {
                                setFilterMonth('');
                                setFilterDate('');
                            }}
                            style={{ alignSelf: 'flex-end' }}
                        >
                            Clear Filters
                        </button>
                    )}
                    <button
                        className="button button--primary"
                        onClick={handleAdd}
                        style={{ alignSelf: 'flex-end' }}
                    >
                        ➕ Add Attendance
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="page-loader">Loading attendance records...</div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="dashboard-grid">
                        <div className="stat-card">
                            <p className="stat-card__label">Employees Tracked</p>
                            <p className="stat-card__value">{summary.uniqueEmployees}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__label">Present</p>
                            <p className="stat-card__value">{summary.presentCount}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__label">Absent</p>
                            <p className="stat-card__value">{summary.absentCount}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__label">Total Records</p>
                            <p className="stat-card__value">{summary.totalRecords}</p>
                        </div>
                    </div>

                    {/* Records Table */}
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Attendance Records</h2>
                            <p>Manage all attendance entries with full CRUD operations.</p>
                        </div>
                        <AttendanceTable
                            records={attendanceRecords}
                            userRole="Admin"
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </section>
                </>
            )}

            {/* Form Modal */}
            {showForm && (
                <AdminAttendanceForm
                    onClose={() => {
                        setShowForm(false);
                        setEditingRecord(null);
                    }}
                    onSuccess={handleFormSuccess}
                    record={editingRecord}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default AdminDashboard;


