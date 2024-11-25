import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './Alerts.css';
import 'primeicons/primeicons.css';

const Alerts = () => {
    const [myAlerts, setMyAlerts] = useState([]);
    const [alertsData, setAlertsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const role = localStorage.getItem('role'); // staff or student
    const userId = localStorage.getItem('userId');
    const labIdInCharge = localStorage.getItem('labIdInCharge');
    const currentRole = localStorage.getItem('role');

    // Fetch notifications based on role
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                let url = '';
                if (role === 'staff' && labIdInCharge) {
                    url = `${import.meta.env.VITE_SERVICE_URL}/api/notifications/lab/${labIdInCharge}`;
                } else if (role === 'student' && userId) {
                    url = `${import.meta.env.VITE_SERVICE_URL}/api/notifications/user/${userId}`;
                } else {
                    console.error('Invalid role or missing parameters');
                    return;
                }

                const response = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const data = await response.json();
                setAlertsData(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [role, userId, labIdInCharge]);

    // Mark a notification as read
    const markAsRead = async (notification) => {
        try {
            let readStatus = currentRole === 'staff' ? !notification.readByInCharge : !notification.readByStudent;

            const response = await fetch(
                `${import.meta.env.VITE_SERVICE_URL}/api/notifications/${notification._id}/${currentRole}/read/${readStatus}`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update local state after marking as read
            setAlertsData((prevData) =>
                prevData.map((item) =>
                    item._id === notification._id
                        ? currentRole === 'staff'
                            ? { ...item, readByInCharge: readStatus }
                            : { ...item, readByStudent: readStatus }
                        : item
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const renderOptions = (rowData) => {
        return (
            <div>
                {role === 'staff' ? (
                    <Button
                        icon={rowData.readByInCharge ? 'pi pi-eye-slash' : 'pi pi-eye'}
                        className="p-button-text visible-or-not-icon"
                        onClick={() => markAsRead(rowData)}
                    />
                ) : role === 'student' ? (
                    <Button
                        icon={rowData.readByStudent ? 'pi pi-eye-slash' : 'pi pi-eye'}
                        className="p-button-text visible-or-not-icon"
                        onClick={() => markAsRead(rowData)}
                    />
                ) : null}
            </div>
        );
    };

    const onComponentSelect = (e) => {
        let selectedIds = [...myAlerts];
        if (e.checked) {
            selectedIds.push(e.value);
        } else {
            selectedIds.splice(selectedIds.indexOf(e.value), 1);
        }
        setMyAlerts(selectedIds);
    };

    const toggleAllComponents = (e) => {
        if (e.checked) {
            setMyAlerts(alertsData.map((item) => item.id));
        } else {
            setMyAlerts([]);
        }
    };

    // Dynamic row class based on read status
    const rowClassName = (rowData) => {
        if (
            (currentRole === 'staff' && !rowData.readByInCharge) ||
            (currentRole === 'student' && !rowData.readByStudent)
        ) {
            return 'unread-notification'; // CSS class for unread notifications
        }
        return '';
    };

    return (
        <div className="my-components">
            <h2>Notification Center</h2>
            <p className="rrs-table-label">All the generated notification and alert logs will be present here!</p>
            {loading ? (
                <p>Loading notifications...</p>
            ) : (
                <DataTable
                    value={alertsData}
                    paginator
                    rows={15}
                    className="table-padding"
                    rowClassName={rowClassName}
                >
                    <Column
                        body={(rowData) => (
                            <Checkbox
                                inputId={`cb_${rowData.id}`}
                                value={rowData.id}
                                onChange={onComponentSelect}
                                checked={myAlerts.includes(rowData.id)}
                            />
                        )}
                        header={
                            <Checkbox
                                inputId="cb_all"
                                onChange={toggleAllComponents}
                                checked={myAlerts.length === alertsData.length}
                            />
                        }
                    />
                    <Column field="component.name" header="Component" />
                    <Column field="createdAt" header="Generated On" />
                    <Column field="details" header="Alert Log" />
                    <Column body={renderOptions} />
                </DataTable>
            )}
        </div>
    );
};

export default Alerts;