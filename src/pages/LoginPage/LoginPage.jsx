import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            console.log('Login successful:', data);

            localStorage.setItem('token', data.token); 
            navigate('/rrs/home');
        } catch (error) {
            setErrorMessage(error.message); 
            console.error('Login failed:', error);
        }
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

    return (
        <div className="login-page">
            <div className="card-container">
                <div className="logo-container">
                    <img src="/login.svg" alt="Logo" className="logo" />
                </div>
                <h1 className="login-title">Login with your Institute Email ID</h1>
                <p className="login-subtext">Enter the details below to login</p>

                <div className="input-container">
                    <label className="input-label">Email ID</label>
                    <input 
                        type="email" 
                        placeholder="xyz@nitc.ac.in" 
                        value={email} 
                        onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
                        className="input-field"
                    />
                    
                    <label className="input-label">Password</label>
                    <input 
                        type="password" 
                        placeholder="**************" 
                        value={password} 
                        onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                        className="input-field"
                    />
                </div>

                <button className="btn-signin" onClick={handleLogin}>
                    Login
                </button>

                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

                <p className="signup-text">
                    Don’t have an account? <span className="create-account" onClick={() => navigate('/signup')}>Create one</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;