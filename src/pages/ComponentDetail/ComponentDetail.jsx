import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Import Toast
import './ComponentDetail.css'; 

const ComponentDetail = () => {
    const location = useLocation(); 
    const item = location.state; 
    const toast = useRef(null); // Create a reference for the toast component
    const navigate = useNavigate(); // Hook to navigate programmatically

    const [purpose, setPurpose] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async () => {
        // Get userId from localStorage or another source
        const userId = localStorage.getItem('userId');

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    componentId: item._id,
                    userId,
                    fromDate,
                    toDate,
                    purpose,
                    labInCharge: item.labInCharge,
                    labIdInCharge: item.labIdInCharge
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create request');
            }

            console.log('Request submitted successfully');
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Request submitted successfully!', life: 3000 }); // Show success toast
            
            // Reset form fields
            setPurpose('');
            setFromDate('');
            setToDate('');

            // Wait for the toast to display before navigating
            setTimeout(() => {
                navigate('/rrs/home'); // Adjust this path as needed
            }, 2000); // Wait for 3 seconds (3000 milliseconds) before navigating
            
        } catch (error) {
            console.error('Error creating request:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to submit request.', life: 3000 }); // Show error toast
        }
    };

    return (
        <div className="card-detail">
            <Toast ref={toast} /> {/* Add Toast component */}
            {item ? (
                <>
                    <h1>{item.name}</h1>
                    <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: 'auto' }} />
                    <p>{item.description}</p>

                    <div className="request-form">
                        <label htmlFor="purpose">Purpose:</label>
                        <textarea
                            id="purpose"
                            value={purpose}
                            placeholder='Write why you need this component in 1-2 sentences'
                            onChange={(e) => setPurpose(e.target.value)}
                            rows="4"
                            style={{ width: '50%', marginBottom: '10px' }}
                        />

                        <p>Duration</p>
                        <label htmlFor="from-date">From:</label>
                        <input
                            type="date"
                            id="from-date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ width: '150px', marginBottom: '10px' }}
                        />

                        <label htmlFor="to-date">To:</label>
                        <input
                            type="date"
                            id="to-date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ width: '150px', marginBottom: '10px' }}
                        />

                        <Button label="Submit Request" onClick={handleSubmit} className="p-button-success" />
                    </div>
                </>
            ) : (
                <p>Item not found.</p>
            )}
        </div>
    );
};

export default ComponentDetail;