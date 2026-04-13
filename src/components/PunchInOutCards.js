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

    const formatLocation = (lat, lon, locationName) => {
        if (locationName) return locationName;
        if (!lat || !lon) return 'Location not recorded';
        return `${parseFloat(lat).toFixed(4)}°, ${parseFloat(lon).toFixed(4)}°`;
    };

    return (
        <div className="punch-cards-container">
            {/* Punch In Card */}
            <div className="punch-card punch-in-card">
                <div className="punch-card-header">
                    <h3>📷 Punch In</h3>
                    <span className="badge badge--active">Entry</span>
                </div>
                <div className="punch-card-body">
                    <div className="punch-detail">
                        <label>TIME & DATE</label>
                        <p>{formatDateTime(record?.punchIn?.time)}</p>
                    </div>
                    <div className="punch-detail">
                        <label>📍 LOCATION</label>
                        <p>{formatLocation(
                            record?.punchIn?.latitude,
                            record?.punchIn?.longitude,
                            record?.punchIn?.locationName
                        )}</p>
                    </div>
                    {record?.punchIn?.photo && (
                        <div className="punch-photo">
                            <img
                                src={record.punchIn.photo}
                                alt="Punch in"
                                className="photo-thumbnail"
                                style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Punch Out Card */}
            <div className="punch-card punch-out-card">
                <div className="punch-card-header">
                    <h3>🔶 Punch Out</h3>
                    {record?.punchOut?.time ? (
                        <span className="badge badge--inactive">Exit</span>
                    ) : (
                        <span className="badge badge--pending">Pending</span>
                    )}
                </div>
                <div className="punch-card-body">
                    <div className="punch-detail">
                        <label>TIME & DATE</label>
                        <p>{formatDateTime(record?.punchOut?.time)}</p>
                    </div>
                    <div className="punch-detail">
                        <label>📍 LOCATION</label>
                        <p>{formatLocation(
                            record?.punchOut?.latitude,
                            record?.punchOut?.longitude,
                            record?.punchOut?.locationName
                        )}</p>
                    </div>
                    {record?.punchOut?.photo && (
                        <div className="punch-photo">
                            <img
                                src={record.punchOut.photo}
                                alt="Punch out"
                                className="photo-thumbnail"
                                style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '12px' }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PunchInOutCards;
