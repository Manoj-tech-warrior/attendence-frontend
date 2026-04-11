import React, { useRef, useState, useEffect } from 'react';
import { punchIn, punchOut } from '../api/attendanceApi';

const MarkAttendanceModal = ({ onClose, onSuccess, isPunchedIn }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        let videoElement = null;

        const init = async () => {
            try {
                // ðŸŽ¥ Start Camera
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    videoElement = videoRef.current;
                    setStreamActive(true);
                }

                // ðŸ“ Get Location
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                            });
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

        // ðŸ§¹ Cleanup
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
            const photoData = canvasRef.current.toDataURL('image/jpeg');
            setPhoto(photoData);
        }
    };

    const handleSubmit = async () => {
        if (!photo) {
            setError('Please capture photo');
            return;
        }

        if (!location) {
            setError('Location not available');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const payload = {
                latitude: location.latitude,
                longitude: location.longitude,
                photo,
            };

            if (isPunchedIn) {
                await punchOut(payload);
            } else {
                await punchIn(payload);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        if (videoRef.current) {
            videoRef.current.play();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content mark-attendance-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isPunchedIn ? 'Punch Out' : 'Punch In'}</h2>
                    <button className="close-btn" onClick={onClose}>Ã—</button>
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
                                <p>ðŸ“ Location Detected</p>
                                <p>Lat: {location.latitude.toFixed(6)}</p>
                                <p>Lng: {location.longitude.toFixed(6)}</p>
                            </>
                        ) : (
                            <p>Getting location...</p>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    {!photo ? (
                        <button onClick={capturePhoto} disabled={!streamActive || loading}>
                            ðŸ“· Capture
                        </button>
                    ) : (
                        <>
                            <button onClick={retakePhoto} disabled={loading}>Retake</button>
                            <button onClick={handleSubmit} disabled={loading || !location}>
                                {loading ? 'Saving...' : 'Confirm'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MarkAttendanceModal;
