import React, { useState } from 'react';
import { Button } from 'primereact/button'; 
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu/SidebarMenu';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import Home from './pages/Home/Home'; 
import MyComponents from './pages/MyComponents/MyComponents';
import Alerts from './pages/Alerts/Alerts';
import Approval from './pages/Approval/Approval';
import Trends from './pages/Trends';
import CardDetail from "./pages/CardDetail/CardDetail";
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';
import './App.css';

const App = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="app-container">
            {location.pathname !== '/' && (
                <Button icon="pi pi-bars" onClick={toggleSidebar} className="p-button-rounded p-button-text" />
            )}
            <SidebarMenu visible={sidebarVisible} onHide={() => setSidebarVisible(false)} />

            <div className="content">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/rrs/home" element={<Home />} />
                        <Route path="/rrs/card-detail" element={<CardDetail />} />
                        <Route path="/rrs/my-components" element={<MyComponents />} />
                        <Route path="/rrs/alerts" element={<Alerts />} />
                        <Route path="/rrs/approval" element={<Approval />} />
                        <Route path="/rrs/trends" element={<Trends />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;