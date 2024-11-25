import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner'; // Import spinner
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [displayUploadDialog, setDisplayUploadDialog] = useState(false);
    const [itemDetails, setItemDetails] = useState({
        name: '',
        description: '',
        labInCharge: localStorage.getItem('labInCharge'),
        labIdInCharge: localStorage.getItem('labIdInCharge'),
        datasheetLink: '',
        tags: '',
        quantity: '',
        category: '',
        imageUrl: 'https://via.placeholder.com/50', // Default image URL
    });
    const [components, setComponents] = useState([]); // State for components
    const [loading, setLoading] = useState(true); // Add loading state

    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchComponents(); // Fetch components on mount
    }, []);

    const fetchComponents = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch components');
            }

            const data = await response.json();
            setComponents(data); // Set fetched components to state
        } catch (error) {
            console.error('Error fetching components:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleButtonClick = (item) => {
        navigate('/rrs/component-detail', { state: item });
    };

    const handleUploadChange = (e) => {
        const { name, value } = e.target;
        setItemDetails({ ...itemDetails, [name]: value });
    };

    const handleUploadSubmit = async () => {
        console.log('Submitting item details:', itemDetails);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(itemDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to upload item');
            }

            // Reset form and close dialog
            setItemDetails({
                name: '',
                description: '',
                labInCharge: localStorage.getItem('labInCharge'),
                labIdInCharge: localStorage.getItem('labIdInCharge'),
                datasheetLink: '',
                tags: '',
                quantity: '',
                category: '',
                imageUrl: 'https://via.placeholder.com/50', // Reset to default image URL
            });
            setDisplayUploadDialog(false);
            fetchComponents(); // Refresh components after upload
        } catch (error) {
            console.error('Error uploading item:', error);
        }
    };

    return (
        <div className="home">
            <div className="header">
                <h1 className="user-greeting">Hello {localStorage.getItem('fullName')}!</h1>
                <div className="greeting-flex">
                    <h4 className="greeting-subtext">See and explore what is available with us below...</h4>
                    {userRole !== 'student' && (
                        <div className="button-group">
                            <Button
                                label="+ Add Item"
                                className="p-button"
                                onClick={() => setDisplayUploadDialog(true)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {loading ? ( // Show spinner while loading
                <div className="loading-state">
                    <ProgressSpinner />
                </div>
            ) : components.length === 0 ? (
                <div className="empty-state">
                    <i className="pi pi-box empty-icon"></i>
                    <p className="empty-label">No components are present in the lab yet!</p>
                </div>
            ) : (
                <div className="card-grid">
                    {components.map((component, index) => (
                        <Card key={index} className="custom-card">
                            <div className="card-content">
                                <div className="card-text">
                                    <h4 className="component-title">{component.name}</h4>
                                    <p className="component-description">{component.description}</p>
                                    <div className="component-category">{component.category}</div>

                                    <div className="card-footer">
                                        <div className="component-quantity">{component.quantity} left</div>
                                    </div>
                                </div>
                                <div className="card-button">
                                    <Button
                                        icon="pi pi-arrow-up-right"
                                        className="add-button"
                                        onClick={() => handleButtonClick(component)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog
                header="Resource Details"
                visible={displayUploadDialog}
                onHide={() => setDisplayUploadDialog(false)}
            >
                <div className="upload-item-form">
                    <div className="form-grid">
                        <div className="form-row">
                            <label className="form-label">Name:</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={itemDetails.name} 
                                onChange={handleUploadChange} 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Description:</label>
                            <input 
                                type="text" 
                                name="description" 
                                value={itemDetails.description} 
                                onChange={handleUploadChange} 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Lab In Charge:</label>
                            <input 
                                type="text" 
                                name="labInCharge" 
                                value={itemDetails.labInCharge} 
                                readOnly 
                                className="form-input readonly-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Datasheet Link:</label>
                            <input 
                                type="text" 
                                name="datasheetLink" 
                                value={itemDetails.datasheetLink} 
                                onChange={handleUploadChange} 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Tags:</label>
                            <input 
                                type="text" 
                                name="tags" 
                                value={itemDetails.tags} 
                                onChange={handleUploadChange} 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Quantity:</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                value={itemDetails.quantity} 
                                onChange={handleUploadChange} 
                                className="form-input"
                            />
                        </div>
                        <div className="form-row">
                            <label className="form-label">Category:</label>
                            <Dropdown 
                                name="category"
                                value={itemDetails.category}
                                options={[
                                    { label: "Microcontrollers", value: "microcontrollers" },
                                    { label: "GPUs", value: "gpus" },
                                    { label: "Drones", value: "drones" },
                                    { label: "Sensors", value: "sensors" },
                                    { label: "Others", value: "others" }
                                ]}
                                onChange={(e) => setItemDetails({ ...itemDetails, category: e.value })}
                                placeholder="Select Category"
                                className="form-dropdown"
                            />
                        </div>
                    </div>

                    <div className="dialog-footer">
                        <Button 
                            label="Submit" 
                            icon="pi pi-check" 
                            onClick={handleUploadSubmit} 
                            className="p-button-success"
                        />
                        <Button 
                            label="Cancel" 
                            onClick={() => setDisplayUploadDialog(false)} 
                            className="p-button-secondary"
                            outlined
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Home;