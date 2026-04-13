import React, { useEffect, useMemo, useState } from 'react';
import AttendanceTable from '../components/AttendanceTable';
import MarkAttendanceModal from '../components/MarkAttendanceModal';
import PunchInOutCards from '../components/PunchInOutCards';
import { fetchAttendanceRecords } from '../api/attendanceApi';
import { getUser } from '../utils/auth';

const EmployeeDashboard = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [filterMonth, setFilterMonth] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const user = getUser();

    const userId = user?.id || user?._id;

    useEffect(() => {
        const loadAttendance = async () => {
            setLoading(true);
            setError('');
            try {
                const records = await fetchAttendanceRecords(filterDate || undefined, filterMonth || undefined);
                setAttendanceRecords(records);
            } catch (err) {
                setError(err?.message || 'Unable to load attendance records.');
            } finally {
                setLoading(false);
            }
        };
        loadAttendance();
    }, [filterDate, filterMonth]);

    const personalRecords = useMemo(() => {
        return attendanceRecords.filter((record) => {
            if (!userId) return true;
            const recordUserId = typeof record.userId === 'object'
                ? record.userId._id || record.userId.id || record.userId.email
                : record.userId;
            return String(recordUserId) === String(userId);
        });
    }, [attendanceRecords, userId]);

    const todayRecord = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return personalRecords.find((record) => {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate.getTime() === today.getTime();
        });
    }, [personalRecords]);

    const isSunday = new Date().getDay() === 0;
    const isPunchedIn = todayRecord?.punchIn?.time;
    const isPunchedOut = todayRecord?.punchOut?.time;

    const summary = useMemo(() => {
        const presentCount = personalRecords.filter((item) => item.status === 'Present').length;
        const absentCount = personalRecords.filter((item) => item.status === 'Absent').length;
        const weekendCount = personalRecords.filter((item) => item.status === 'Weekly Off').length;
        return {
            totalDays: personalRecords.length,
            presentCount,
            absentCount,
            weekendCount,
        };
    }, [personalRecords]);

    const handleSuccess = async () => {
        setShowModal(false); // ← Pehle modal band karo
        setFilterDate('');
        setFilterMonth('');
        setLoading(true);
        setError('');
        try {
            const records = await fetchAttendanceRecords(undefined, undefined);
            setAttendanceRecords(records);
        } catch (err) {
            setError(err?.message || 'Unable to load attendance records.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
    };

    const getTodayStatus = () => {
        if (isSunday) return 'Weekly Off';
        if (todayRecord?.punchIn?.time) return 'Marked';
        return 'Not Marked';
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div>
                    <p className="eyebrow">Employee Dashboard</p>
                    <h1>Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
                    <p className="dashboard-copy">Mark your attendance, view records, and track your presence.</p>
                </div>
            </div>

            {error && <div className="alert alert--error">{error}</div>}

            {!isSunday && (
                <div className="today-status-card">
                    <div className="status-content">
                        <h3>Today's Attendance</h3>
                        <p className={`status-badge-text status-badge-text--${getTodayStatus().toLowerCase()}`}>
                            {getTodayStatus()}
                        </p>
                        {todayRecord?.punchIn?.time && (
                            <p className="punch-time">Punched in at {new Date(todayRecord.punchIn.time).toLocaleTimeString()}</p>
                        )}
                    </div>
                    <button
                        className={`button button--${isSunday || isPunchedOut || loading ? 'disabled' : 'primary'}`}
                        onClick={() => !loading && setShowModal(true)}
                        disabled={isSunday || isPunchedOut || loading}
                    >
                        {loading ? '⏳ Loading...' : isPunchedIn ? '👋 Punch Out' : '✋ Punch In'}
                    </button>
                </div>
            )}

            {isSunday && (
                <div className="alert alert--info">
                    🎉 Today is a Sunday - Weekly Off
                </div>
            )}

            {loading ? (
                <div className="page-loader">Loading attendance records...</div>
            ) : (
                <>
                    <div className="dashboard-grid employee-grid">
                        <div className="stat-card">
                            <p className="stat-card__label">Total days tracked</p>
                            <p className="stat-card__value">{summary.totalDays}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__label">Days present</p>
                            <p className="stat-card__value">{summary.presentCount}</p>
                        </div>
                        <div className="stat-card">
                            <p className="stat-card__label">Days off</p>
                            <p className="stat-card__value">{summary.weekendCount}</p>
                        </div>
                    </div>

                    {todayRecord && (
                        <section className="dashboard-section">
                            <div className="section-header">
                                <h2>Today's Check-ins</h2>
                                <p>{getCurrentDateString()}</p>
                            </div>
                            <PunchInOutCards record={todayRecord} />
                        </section>
                    )}

                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Your attendance records</h2>
                            <p>Filter by month or date to view your history.</p>
                        </div>

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
                        </div>

                        {personalRecords.length > 0 ? (
                            <AttendanceTable records={personalRecords} userRole="Employee" />
                        ) : (
                            <div className="empty-state">
                                No attendance records found for the selected period.
                            </div>
                        )}
                    </section>
                </>
            )}

            {showModal && (
                <MarkAttendanceModal
                    onClose={() => setShowModal(false)}
                    onSuccess={handleSuccess}
                    isPunchedIn={isPunchedIn}
                />
            )}
        </div>
    );
};

export default EmployeeDashboard;
