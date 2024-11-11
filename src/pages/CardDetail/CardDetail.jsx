import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from 'primereact/button';
import './CardDetail.css'; 

const CardDetail = () => {
    const location = useLocation(); 
    const item = location.state; 

    
    const [purpose, setPurpose] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleSubmit = () => {
        
        console.log('Purpose:', purpose);
        console.log('From Date:', fromDate);
        console.log('To Date:', toDate);
        
    };

    return (
        <div className="card-detail">
            {item ? (
                <>
                    <h1>{item.title}</h1>
                    <img src={item.image} alt={item.title} style={{ width: '100px', height: 'auto' }} />
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

export default CardDetail;