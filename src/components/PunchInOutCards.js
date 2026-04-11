import React from 'react';

const PunchInOutCards = ({ record }) => {
    const formatDateTime = (dateString) => {
        if (!dateString) return 'Not recorded';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatLocation = (lat, lon) => {
        if (!lat || !lon) return 'Location not recorded';
        return `${lat.toFixed(4)}Â°, ${lon.toFixed(4)}Â°`;
    };

    return (
        <div className="punch-cards-container">
            <div className="punch-card punch-in-card">
                <div className="punch-card-header">
                    <h3>ðŸ”· Punch In</h3>
                    <span className="badge badge--active">Entry</span>
                </div>
                <div className="punch-card-body">
                    <div className="punch-detail">
                        <label>Time & Date</label>
                        <p>{formatDateTime(record?.punchIn?.time)}</p>
                    </div>
                    <div className="punch-detail">
                        <label>ðŸ“ Location</label>
                        <p>{formatLocation(record?.punchIn?.latitude, record?.punchIn?.longitude)}</p>
                    </div>
                    {record?.punchIn?.photo && (
                        <div className="punch-photo">
                            <img
                                src={record.punchIn.photo}
                                alt="Punch in"
                                className="photo-thumbnail"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="punch-card punch-out-card">
                <div className="punch-card-header">
                    <h3>ðŸ”¶ Punch Out</h3>
                    {record?.punchOut?.time ? (
                        <span className="badge badge--inactive">Exit</span>
                    ) : (
                        <span className="badge badge--pending">Pending</span>
                    )}
                </div>
                <div className="punch-card-body">
                    <div className="punch-detail">
                        <label>Time & Date</label>
                        <p>{formatDateTime(record?.punchOut?.time)}</p>
                    </div>
                    <div className="punch-detail">
                        <label>ðŸ“ Location</label>
                        <p>{formatLocation(record?.punchOut?.latitude, record?.punchOut?.longitude)}</p>
                    </div>
                    {record?.punchOut?.photo && (
                        <div className="punch-photo">
                            <img
                                src={record.punchOut.photo}
                                alt="Punch out"
                                className="photo-thumbnail"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PunchInOutCards;

