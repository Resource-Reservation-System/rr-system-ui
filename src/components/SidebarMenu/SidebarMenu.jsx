import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import { NavLink, useNavigate } from 'react-router-dom'; 
import './SidebarMenu.css';

const SidebarMenu = ({ visible, onHide }) => {
    const navigate = useNavigate();
    
    // Retrieve user role from localStorage
    const userRole = localStorage.getItem('role'); // Assuming you store user role in localStorage

    const handleLogout = async () => {
        try {
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('username');
            localStorage.removeItem('role'); // Remove role on logout
            
            onHide();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Sidebar visible={visible} onHide={onHide} position="left" style={{ width: '250px' }}>
            <div className="sidebar-header flex">
                <img src="/rrs.svg" alt="Logo" className="sidebar-logo" />
                <div>
                    <h2 className="sidebar-title">Resource Reservation System</h2>
                    <h4 className="sidebar-title">v 0.0.1</h4>
                </div>
            </div>

            <ul className="p-sidebar-menu sidebar">
                <li>
                    <NavLink to="/rrs/home" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <i className="pi pi-home" style={{ marginRight: '8px' }}></i>
                        Home
                    </NavLink>
                </li>
                <hr />


                {/* Render Users link only for admin */}
                {userRole === 'admin' && (
                    <>
                        <li>
                            <NavLink to="/rrs/users" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                                <i className="pi pi-users" style={{ marginRight: '8px' }}></i>
                                Users
                            </NavLink>
                        </li>
                        <hr />
                    </>
                )}

                {/* Render Approval and Trends links only for staff */}
                {userRole === 'staff' && (
                    <>
                        <li>
                            <NavLink to="/rrs/approval" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                                <i className="pi pi-file-check" style={{ marginRight: '8px' }}></i>
                                Approval
                            </NavLink>
                        </li>
                        <hr />
                    </>
                )}

                {(userRole === 'staff' || userRole === 'student') && (
                    <>
                        <li>
                            <NavLink to="/rrs/my-components" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                                <i className="pi pi-th-large" style={{ marginRight: '8px' }}></i>
                                My Components
                            </NavLink>
                        </li>
                        <hr />
                        
                        <li>
                            <NavLink to="/rrs/alerts" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                                <i className="pi pi-bell" style={{ marginRight: '8px' }}></i>
                                Alerts
                            </NavLink>
                        </li>
                        <hr />
                    </>
                )}

                {userRole === 'staff' && (
                    <>
                        <li>
                            <NavLink to="/rrs/trends" onClick={onHide} className={({ isActive }) => (isActive ? 'active' : '')}>
                                <i className="pi pi-chart-line" style={{ marginRight: '8px' }}></i>
                                Trends
                            </NavLink>
                        </li>
                        <hr />
                    </>
                )}

                {/* Render Logout option */}
                <li onClick={handleLogout} >
                    <a href="#" className="sidebar-link">
                        <i className="pi pi-sign-out" style={{ marginRight: '8px' }}></i>
                        Logout
                    </a>
                </li>
            </ul>
        </Sidebar>
    );
};

export default SidebarMenu;