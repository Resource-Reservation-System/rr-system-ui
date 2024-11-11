import React from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import './Home.css'

const items = [
    { title: 'Recently Added', description: 'Latest items added to your inventory.', image: 'https://via.placeholder.com/50' },
    { title: 'Microcontrollers', description: 'Various microcontrollers for your projects.', image: 'https://via.placeholder.com/50' },
    { title: 'Sensors', description: 'Different types of sensors available.', image: 'https://via.placeholder.com/50' },
    { title: 'GPUs', description: 'Graphics processing units for high-performance tasks.', image: 'https://via.placeholder.com/50' },
    { title: 'Drones', description: 'Explore our range of drones.', image: 'https://via.placeholder.com/50' },
    { title: 'Others', description: 'Miscellaneous items.', image: 'https://via.placeholder.com/50' },
];

const Home = () => {
    const navigate = useNavigate();
    const handleButtonClick = (item) => {
        navigate('/card-detail', { state: item });
    };

    return (
        <div className="home">
            <div className="header">
                <h1 className="user-greeting">Hello Tom!</h1>
                <div className="greeting-flex">
                    <h4 className="greeting-subtext">What’s in store...</h4>
                    <div className="button-group">
                        <Button label="My Items" className="p-button" />
                        <Button label="+ Upload" className="p-button" />
                    </div>
                </div>

                <div className="button-group button-categories">
                    {items.map((item, index) => (
                        <Button label={item.title} key={index} className="p-button p-button-outlined" />
                    ))}
                </div>
            </div>
            
            <div className="card-grid">
                {items.map((item, index) => (
                    <Card key={index} style={{ width: '310px', marginBottom: '10px' }}>
                        <img src={item.image} alt={item.title} style={{ width: '100%', height: 'auto' }} />
                        <div className="card-content">
                            <div className="card-text">
                                <h4 className="component-title">{item.title}</h4>
                                <p className="component-description">{item.description}</p>
                            </div>
                            <div>
                                <Button icon="pi pi-plus" className="p-button-success" onClick={() => handleButtonClick(item)} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Home;