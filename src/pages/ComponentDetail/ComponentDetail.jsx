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

    const createNotification = async (userId, item) => {
        try {
            const notificationDetails = {
                user: userId,
                component: item._id,
                lab: item.labIdInCharge,
                details: `Request created for the component ${item.name} under the lab ${item.labInCharge} by ${localStorage.getItem('fullName')}`
            };
    
            const notificationResponse = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/notifications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(notificationDetails)
            });
    
            if (!notificationResponse.ok) {
                console.error('Failed to create notification');
            } else {
                console.log('Notification created successfully');
            }
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

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
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Request submitted successfully!', life: 1500 });
            
            setPurpose('');
            setFromDate('');
            setToDate('');

            await createNotification(userId, item);

            setTimeout(() => {
                navigate('/rrs/home');
            }, 1500);
            
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
                    <h1>Component: {item.name}</h1>
                    {/* <img src={item.imageUrl} alt={item.title} style={{ width: '100px', height: 'auto' }} /> */}
                    <p className="description">{item.description}</p>
                    <p className="component-category">{item.category}</p>
                    <p className="component-tags">Tags: {item.tags}</p>
                    <p className="description">Fill the request form for getting the component {item.name}</p>
                    <p className="item-quantity">{item.quantity} left</p>

                    <div className="request-form">
                        <label className="request-label" htmlFor="purpose">Purpose:</label>
                        <textarea
                            id="purpose"
                            value={purpose}
                            placeholder='Write why you need this component in 1-2 sentences'
                            onChange={(e) => setPurpose(e.target.value)}
                            rows="10"
                            style={{ width: '30%', marginBottom: '10px' }}
                        />

                        <p className="request-label">Duration</p>
                        <label className="request-label" htmlFor="from-date">From:</label>
                        <input
                            type="date"
                            id="from-date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ width: '150px', marginBottom: '10px' }}
                            min={new Date().toISOString().split('T')[0]}
                        />

                        <label className="request-label" htmlFor="to-date">To:</label>
                        <input
                            type="date"
                            id="to-date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ width: '150px', marginBottom: '10px' }}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="button-container"> 
                        <Button label="Submit Request" onClick={handleSubmit} className="p-button-success submit-button" />
                        <Button label="Cancel Request" onClick={() => navigate('/rrs/home')} className="p-button-success cancel-button" />
                    </div>
                </>
            ) : (
                <p>Item not found.</p>
            )}
        </div>
    );
};

export default ComponentDetail;