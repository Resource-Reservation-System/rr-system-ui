import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import '../LoginPage/LoginPage.css'; 

const SignupPage = () => {
    const navigate = useNavigate();
    const toast = React.useRef(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match'});
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
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration successful!', life: 3000 });
            setName('');
            setEmail('');
            setPassword('');
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        }
    };

    return (
        <div className="signup-page">
            <Toast ref={toast} className='toast'/>
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
                        onChange={(e) => setName(e.target.value)} 
                        className="input-field"
                    />
                    
                    <label className="input-label">Email ID</label>
                    <input 
                        type="email" 
                        placeholder="xyz@nitc.ac.in" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="input-field"
                    />
                    
                    <label className="input-label">Password</label>
                    <input 
                        type="password" 
                        placeholder="**************" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input-field"
                    />

                    <label className="input-label">Confirm Password</label>
                    <input 
                        type="password" 
                        placeholder="**************" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="input-field"
                    />
                </div>

                <button className="btn-signin" onClick={handleSignup}>
                    Sign Up
                </button>

                <p className="signup-text">
                    Already have an account? <span className="create-account" onClick={() => navigate('/login')}>Login</span>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;