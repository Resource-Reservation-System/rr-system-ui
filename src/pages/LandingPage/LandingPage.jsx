import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <div className="header-buttons">
                <button 
                    className="btn-login" 
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                <button 
                    className="btn-signup" 
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>
            </div>

            <div className="hero-section">
                <img src="/rrs.svg" alt="Hero" className="hero-image" />
                <h1 className="hero-title">Resource Reservation</h1>
                <h1 className="hero-title">System</h1>
                <p className="hero-subtitle">Effortless Borrowing, Simplified Management</p>
                <hr className="landing-hr"/>
                <div className="hero-buttons">
                    <button 
                        className="btn-get-started" 
                        onClick={() => navigate('/login')}
                    >
                        Get Started 
                        <i className="pi pi-arrow-right" style={{ marginLeft: '8px' }}></i>
                    </button>
                    
                    <button 
                        className="btn-learn-more" 
                        onClick={() => navigate('/')}
                    >
                        Learn More
                        <i className="pi pi-arrow-right" style={{ marginLeft: '8px' }}></i>
                    </button>
                </div>
            </div>

            <div className="grid-container">
                <div className="grid-item">
                    <i className="pi pi-stopwatch"></i>
                    <h3>Instant Requests</h3>
                    <p>Browse and request components with just a few clicks!</p>
                </div>
                <div className="grid-item">
                    <i className="pi pi-warehouse"></i>
                    <h3>Real Time Inventory</h3>
                    <p>Stay updated on component availability and status</p>
                </div>
                <div className="grid-item">
                    <i className="pi pi-users"></i>
                    <h3>Queue & Notification</h3>
                    <p>Get notified when items are ready for you</p>
                </div>
                <div className="grid-item">
                    <i className="pi pi-directions-alt"></i>
                    <h3>Seamless Returns</h3>
                    <p>Easily manage and return components when you're done</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;