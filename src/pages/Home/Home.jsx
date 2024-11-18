import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
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
        imageUrl: 'https://via.placeholder.com/50' // Default image URL
    });
    const [components, setComponents] = useState([]); // State for components

    useEffect(() => {
        fetchComponents(); // Fetch components on mount
    }, []);

    const fetchComponents = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for authorization
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(itemDetails)
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
                imageUrl: 'https://via.placeholder.com/50' // Reset to default image URL                
            });
            setDisplayUploadDialog(false);
            // Optionally refresh data or show success message
            fetchComponents(); // Refresh components after upload
        } catch (error) {
            console.error('Error uploading item:', error);
            // Show error notification here if needed
        }
    };

    return (
        <div className="home">
            <div className="header">
                <h1 className="user-greeting">Hello {localStorage.getItem('fullName')}!</h1>
                <div className="greeting-flex">
                    <h4 className="greeting-subtext">What’s in store...</h4>
                    <div className="button-group">
                        <Button label="My Items" className="p-button" />
                        <Button label="+ Upload" className="p-button" onClick={() => setDisplayUploadDialog(true)} />
                    </div>
                </div>

                <div className="button-group button-categories">
                    {/* Render buttons for categories based on fetched data */}
                    {components.map((component, index) => (
                        <Button 
                            label={component.category} 
                            key={index} 
                            className="p-button p-button-outlined" 
                            onClick={() => handleButtonClick(component)}
                        />
                    ))}
                </div>
            </div>
            
            <div className="card-grid">
                {components.map((component, index) => (
                    <Card key={index} style={{ width: '310px', marginBottom: '10px' }}>
                        <img src={component.imageUrl} alt={component.name} style={{ width: '100%', height: 'auto' }} />
                        <div className="card-content">
                            <div className="card-text">
                                <h4 className="component-title">{component.name}</h4>
                                <p className="component-description">{component.description}</p>
                                <p className="component-description">{component.quantity} left</p>
                            </div>
                            <div>
                                <Button icon="pi pi-plus" className="p-button-success" onClick={() => handleButtonClick(component)} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Dialog for uploading items */}
            <Dialog 
                header="Upload Item" 
                visible={displayUploadDialog} 
                onHide={() => setDisplayUploadDialog(false)} 
                style={{ width: '50vw' }} 
            >
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={itemDetails.name} onChange={handleUploadChange} />
                    
                    <label>Description:</label>
                    <input type="text" name="description" value={itemDetails.description} onChange={handleUploadChange} />

                    <label>Lab In Charge:</label>
                    <input type="text" name="labInCharge" value={itemDetails.labInCharge} readOnly />

                    <label>Datasheet Link:</label>
                    <input type="text" name="datasheetLink" value={itemDetails.datasheetLink} onChange={handleUploadChange} />

                    <label>Tags:</label>
                    <input type="text" name="tags" value={itemDetails.tags} onChange={handleUploadChange} />

                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={itemDetails.quantity} onChange={handleUploadChange} />

                    {/* Remove Image URL input as per requirement */}
                    
                    <label>Category:</label>
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
                    />
                </div>

                <Button label="Submit" icon="pi pi-check" onClick={handleUploadSubmit} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayUploadDialog(false)} className="p-button-secondary" />
            </Dialog>
        </div>
    );
};

export default Home;