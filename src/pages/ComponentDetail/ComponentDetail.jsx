import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Import Toast
import './ComponentDetail.css'; 

const ComponentDetail = () => {
    const location = useLocation(); 
    const item = location.state; 
    const toast = useRef(null);
    const navigate = useNavigate();

    const [purpose, setPurpose] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = async () => {
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
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Request submitted successfully!', life: 2000 });
            
            setPurpose('');
            setFromDate('');
            setToDate('');

            setTimeout(() => {
                navigate('/rrs/home');
            }, 2000);
            
        } catch (error) {
            console.error('Error creating request:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to submit request.', life: 2000 });
        }
    };

    return (
        <div className="card-detail">
            <Toast ref={toast} />
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