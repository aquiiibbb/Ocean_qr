import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import qrCodeImage from './assets/qr-code.png';
import hotelLogo from './assets/logo.jpg';
import bg from './assets/bg.gif';

export default function ReviewHomePage() {
    const navigate = useNavigate();
    const [showQRScanner, setShowQRScanner] = useState(false);
    const cameraRef = useRef(null);

    const navigateToSurvey = () => {
        navigate('/FeedbackSurvey');
    };

    const openTripAdvisor = () => {
        window.open(
            'https://www.tripadvisor.com/Hotel_Review-g297628-d622777-Reviews-Cross_Roads_Inn-Bengaluru_Bangalore_District_Karnataka.html?m=19905',
            '_blank'
        );
    };

    const openGoogleReviews = () => {
        window.open(
            'https://www.google.com/travel/hotels/entity/CgoIm8ewyPDBoJlaEAE?q=crossroads%20inn%20fort%20pierce&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764&hl=en-US&gl=us&ssta=1&ts=CAEaSQorEicyJTB4ODhkZWYzNGRiMjAwNzRhMToweDVhMzI4MjBmMDkwYzIzOWIaABIaEhQKBwjqDxAEGBcSBwjqDxAEGBgYATICEAAqCQoFOgNVU0QaAA&qs=CAE4AkIJCZsjDAkPgjJaQgkJmyMMCQ-CMlo&ved=0CAAQ5JsGahcKEwiI0ojqhISUAxUAAAAAHQAAAAAQAw&ictx=111&utm_campaign=sharing&utm_medium=link&utm_source=htls',
            '_blank'
        );
    };

    useEffect(() => {
        if (showQRScanner && cameraRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    cameraRef.current.srcObject = stream;
                })
                .catch((err) => {
                    console.error('Camera access denied:', err);
                    alert('Camera access needed for QR scanning');
                    setShowQRScanner(false);
                });
        }

        return () => {
            if (cameraRef.current && cameraRef.current.srcObject) {
                const tracks = cameraRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [showQRScanner]);

    if (showQRScanner) {
        return (
            <div className="camera-scanner">
                <video ref={cameraRef} autoPlay className="camera-feed" />

                <div className="scanner-controls">
                    <button
                        className="scanner-btn close-btn"
                        onClick={() => setShowQRScanner(false)}
                    >
                        Close Scanner
                    </button>

                    <button
                        className="scanner-btn survey-btn"
                        onClick={() => navigate('/FeedbackSurvey')}
                    >
                        Go to Survey
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="review-homepage">
            <div className="review-card">

                {/* Header */}
                <div className="card-top">
                    <div className="logo-wrap">
                        <img
                            className="logo-image"
                            src={hotelLogo}
                            alt="CrossRoad Inn Hotel Logo"
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="card-body">

                    {/* Google Review Button */}
                    <button
                        className="platform-btn google-btn"
                        onClick={openGoogleReviews}
                        aria-label="Leave review on Google"
                    >
                        <div className="platform-icon-wrap g-icon">
                            <svg width="96" height="96" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        </div>
                    </button>

                    <p className="review-heading">
                        Enjoyed Your Stay? Review Us on Google
                    </p>

                    {/* QR Code */}
                    <div className="qr-interaction" onClick={navigateToSurvey}>
                        <div className="qr-container">
                            <img
                                src={qrCodeImage}
                                alt="QR Code for Hotel Reviews"
                                className="qr-code-image"
                            />
                        </div>

                        {/* Reward Text */}
                        <p className="reward-text">
                            Contact Front Desk team to collect your review reward.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="card-footer">
                    <h2 className="footer-hotel-name">
                        OCEAN PARRADISE
                    </h2>

                    <p className="footer-hotel-tagline">
                        773 Ocean Shores Blvd NW, Ocean Shores
                    </p>

                    <p
                        className="footer-hotel-tagline"
                        style={{ color: 'white' }}
                    >
                        📞 +1 360-289-0664
                    </p>
                </div>
            </div>
        </div>
    );
}