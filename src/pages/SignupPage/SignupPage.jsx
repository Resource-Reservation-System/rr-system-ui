import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css'; 
import { Toast } from 'primereact/toast';

const SignupPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // Error message state
    const toast = useRef(null);

    const handleSignup = async () => {
        // Reset error message
        setErrorMessage('');

        // Validate email format
        if (!email.endsWith('@nitc.ac.in')) {
            setErrorMessage('Enter a valid email ID');
            return;
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: name,
                    email: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            toast.current.show({ severity: 'success', summary: 'Success', detail: `Registred Successfully!`, life: 1500 });

            setTimeout(() => {
                navigate('/login');
            }, 1500); 

        } catch (error) {
            setErrorMessage(error.message || 'An error occurred during registration.');
        }
    };

    const handleInputChange = () => {
        setErrorMessage('');
    };

    return (
        <div className="signup-page">
            <div className="card-container">
                <div className="logo-container">
                    <img src="/login.svg" alt="Logo" className="logo" />
                </div>
                <h1 className="login-title">Create Your Account</h1>
                <p className="login-subtext">Enter the details below to sign up</p>

                <div className="input-container">
                    <label className="input-label">Name</label>
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={name} 
                        onChange={(e) => { setName(e.target.value); handleInputChange(); }} 
                        className="input-field"
                    />
                    
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

                    <label className="input-label">Confirm Password</label>
                    <input 
                        type="password" 
                        placeholder="**************" 
                        value={confirmPassword} 
                        onChange={(e) => { setConfirmPassword(e.target.value); handleInputChange(); }} 
                        className="input-field"
                    />
                </div>

                <button className="btn-signin" onClick={handleSignup}>
                    Sign Up
                </button>

                {/* Display error message */}
                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}

                <p className="signup-text">
                    Already have an account? <span className="create-account" onClick={() => navigate('/login')}>Login</span>
                </p>

                <Toast ref={toast} />
            </div>
        </div>
    );
};

export default SignupPage;