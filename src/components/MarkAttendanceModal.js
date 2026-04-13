import React, { useRef, useState, useEffect } from 'react';
import { punchIn, punchOut } from '../api/attendanceApi';

const MarkAttendanceModal = ({ onClose, onSuccess, isPunchedIn }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState('');
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        let videoElement = null;

        const init = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    videoElement = videoRef.current;
                    setStreamActive(true);
                }

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;

                            setLocation({
                                latitude: lat,
                                longitude: lng,
                                accuracy: position.coords.accuracy,
                            });

                            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                                .then(res => res.json())
                                .then(data => {
                                    const locality = data.address?.suburb ||
                                        data.address?.neighbourhood ||
                                        data.address?.locality ||
                                        data.address?.road || '';
                                    const city = data.address?.city ||
                                        data.address?.town ||
                                        data.address?.village ||
                                        data.address?.county || '';
                                    const state = data.address?.state || '';
                                    const parts = [locality, city, state].filter(Boolean);
                                    setLocationName(parts.join(', '));
                                })
                                .catch(() => setLocationName(''));
                        },
                        () => {
                            setError('Unable to get location. Please enable location.');
                        }
                    );
                } else {
                    setError('Geolocation not supported.');
                }

            } catch (err) {
                setError('Camera access denied or not working.');
            }
        };

        init();

        return () => {
            if (videoElement && videoElement.srcObject) {
                videoElement.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            const photoData = canvasRef.current.toDataURL('image/jpeg', 0.5);
            setPhoto(photoData);

            if (videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }
    };

    const handleSubmit = async () => {
        if (!photo) {
            setError('Please capture photo');
            return;
        }

        if (!location) {
            setError('Location not available. Please wait or enable location.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                latitude: location.latitude,
                longitude: location.longitude,
                locationName: locationName,
                photo,
            };

            if (isPunchedIn) {
                await punchOut(payload);
            } else {
                await punchIn(payload);
            }

            onSuccess();
            
        } catch (err) {
            const msg = err?.data?.message || err?.message || err || 'Something went wrong';
            setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
        }).then(stream => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setStreamActive(true);
            }
        }).catch(() => {
            setError('Camera access denied.');
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content mark-attendance-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isPunchedIn ? 'Punch Out' : 'Punch In'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {error && <div className="alert alert--error">{error}</div>}

                <div className="modal-body">
                    {!photo ? (
                        <div className="camera-container">
                            <video ref={videoRef} autoPlay playsInline className="camera-feed" />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                    ) : (
                        <div className="photo-preview">
                            <img src={photo} alt="Captured" className="preview-image" />
                        </div>
                    )}

                    <div className="location-info">
                        {location ? (
                            <>
                                <p>📍 {locationName || 'Location Detected'}</p>
                                <p>Lat: {location.latitude.toFixed(6)}</p>
                                <p>Lng: {location.longitude.toFixed(6)}</p>
                            </>
                        ) : (
                            <p>📍 Getting location...</p>
                        )}
                    </div>
                </div>

                <div className="modal-footer" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '16px'
                }}>
                    {!photo ? (
                        <button
                            onClick={capturePhoto}
                            disabled={!streamActive || loading}
                            style={{
                                backgroundColor: '#3B82F6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '14px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                width: '100%'
                            }}
                        >
                            📷 Capture
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={retakePhoto}
                                disabled={loading}
                                style={{
                                    backgroundColor: 'white',
                                    color: '#EF4444',
                                    border: '2px solid #EF4444',
                                    borderRadius: '12px',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                🔄 Retake
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !location}
                                style={{
                                    backgroundColor: loading ? '#9CA3AF' : '#22C55E',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '14px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    width: '100%'
                                }}
                            >
                                {loading ? '⏳ Saving...' : '✅ Confirm'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarkAttendanceModal;
