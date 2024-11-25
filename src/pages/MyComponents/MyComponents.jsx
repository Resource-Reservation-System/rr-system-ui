import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog } from 'primereact/confirmdialog';
import './MyComponents.css'; 
import 'primeicons/primeicons.css'; 

const MyComponents = () => {
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [returnedRequests, setReturnedRequests] = useState([]);
    const [noteDialogVisible, setNoteDialogVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState('');
    const [otherRequests, setOtherRequests] = useState([]);
    const [deleteRequest, setDeleteRequest] = useState(null);
    const [deleteVisible, setDeleteVisible] = useState(false);

    const [visible, setVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const toast = useRef(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUserRequests();
    }, []);

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setNoteDialogVisible(true);
    };

    const createNotification = async (userId, item, cancelRequest=false) => {
        try {
            let notificationMessage;
            if (cancelRequest === true) {
                notificationMessage = `Cancelled the request created for the component ${item.component.name} under the lab ${item.labInCharge} by ${localStorage.getItem('fullName')}`
            } else {
                notificationMessage = `Return request created for the component ${item.component.name} under the lab ${item.labInCharge} by ${localStorage.getItem('fullName')}`
            }
            const notificationDetails = {
                user: userId,
                component: item.component._id,
                lab: item.labIdInCharge,
                details: notificationMessage
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

    const fetchUserRequests = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/user?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user requests');
            }

            const data = await response.json();

            const approved = data.filter(request => (request.status === 'approved' || request.status === 'verification') && request.inHold === true);
            const others = data.filter(request => !(request.status === 'approved' || request.status === 'verification' || request.status === 'returned' || request.status === 'rejected'));
            const returned = data.filter(request => (request.status === 'returned' || request.status === 'rejected'));


            setApprovedRequests(approved);
            setReturnedRequests(returned);
            setOtherRequests(others);
        } catch (error) {
            console.error('Error fetching user requests:', error);
        }
    };

    const handleReturn = (rowData) => {
        setSelectedRequest(rowData);
        setVisible(true); // Show the confirmation dialog
    };

    const confirmReturn = async () => {
        if (!selectedRequest) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${selectedRequest._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'verification', notes: 'in verification' })
            });

            if (!response.ok) {
                throw new Error('Failed to update request status');
            }

            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Component returned successfully!', life: 3000 });
            fetchUserRequests(); // Refresh the data after updating
            await createNotification(userId, selectedRequest);
        } catch (error) {
            console.error('Error updating request status:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update request status.', life: 3000 });
        } finally {
            setVisible(false); // Close the dialog
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const calculatePenalty = (returnDate) => {
        const currentDate = new Date();
        const returnDateObj = new Date(returnDate);
        const timeDiff = returnDateObj - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysDiff < 0 ? Math.abs(daysDiff) : 0;
    };

    const handleDelete = (rowData) => {
        setDeleteRequest(rowData);
        setDeleteVisible(true); // Show the delete confirmation dialog
    };

    const confirmDelete = async () => {
        if (!deleteRequest || !deleteRequest._id) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${deleteRequest._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
        
            if (!response.ok) {
                throw new Error('Failed to delete the request');
            }
        
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Request deleted successfully!', life: 3000 });
            await createNotification(userId, deleteRequest, true); // Ensure the correct request is used
            fetchUserRequests(); // Refresh data after deletion
        } catch (error) {
            console.error('Error deleting request:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete the request.', life: 3000 });
        } finally {
            setDeleteRequest(null);
            setDeleteVisible(false); // Close the dialog
        }
    };
    
    


    return (
        <div className="my-components">            
            <h2>Current Holdings</h2>
            <p className="rrs-table-label">Information about the components which you are currently holding</p>
            <DataTable value={approvedRequests} paginator rows={5} className="table-padding">
                <Column field="component.name" header="Component" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" />
                <Column field="toDate" header="To Date" />
                <Column field="penalty" header="Penalty (in ₹)" body={(rowData) => calculatePenalty(rowData.toDate)} />
                <Column
                    field="notes"
                    header="Additional Info"
                    body={(rowData) => (
                        rowData.notes ? (
                            <div>
                                <Button className="notes" label={rowData.notes} severity="warning" />
                            </div>
                        ) : null
                    )}
                />
                <Column body={(rowData) => (
                    rowData.status !== "verification" ? (
                        <Button label="RETURN" className="p-button-text verification-button" onClick={() => handleReturn(rowData)} />
                    ) : null
                )} header="Actions" />
            </DataTable>

            <h2>Pending Resource Requests</h2>
            <p className="rrs-table-label">All the requests which was created by you but not yet approved will be present here</p>
            <DataTable value={otherRequests} paginator rows={5} className="table-padding">
                <Column field="component.name" header="Component" />
                <Column field="status" header="Request Status" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" body={(rowData) => formatDate(rowData.fromDate)}/>
                <Column field="toDate" header="To Date" body={(rowData) => formatDate(rowData.toDate)}/>
                <Column field="createdAt" header="Booking Date" />
                <Column
                    body={(rowData) => (
                        <div>
                            <Button
                                icon="pi pi-trash approval-icon"
                                className="p-button-text"
                                onClick={() => handleDelete(rowData)}
                            />
                        </div>
                    )}
                    header="Actions"
                />
            </DataTable>

            <Toast ref={toast} />

            <ConfirmDialog
                visible={deleteVisible}
                onHide={() => setDeleteVisible(false)}
                message={`Are you sure you want to delete the request for ${deleteRequest ? deleteRequest.component.name : ''}?`}
                header="Confirm Deletion"
                icon="pi pi-exclamation-triangle"
                accept={confirmDelete}
                reject={() => setDeleteVisible(false)}
                className="confirm-dialog-custom"
            />
            
            {/* ConfirmDialog for confirmation */}
            <ConfirmDialog 
                visible={visible}
                onHide={() => setVisible(false)}
                message={`Are you sure you want to return ${selectedRequest ? selectedRequest.component.name : ''}?`}
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={confirmReturn}
                reject={() => setVisible(false)}
                className="confirm-dialog-custom" // Apply the custom styles
            />



            <h2>Past Requests</h2>
            <p className="rrs-table-label">History about the all the components you have used before</p>
            <DataTable value={returnedRequests} paginator rows={7} className="table-padding">
                <Column field="component.name" header="Component" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" />
                <Column field="toDate" header="To Date" />
                <Column
                    field="status"
                    header="Additional Info"
                    body={(rowData) => (
                    rowData.status === 'rejected' && rowData.notes ? (
                        <Button
                            label={rowData.status}
                            className="p-button-text p-button-danger reject-note"
                            onClick={() => handleNoteClick(rowData.notes)}
                        />
                    ) : null
                    )}
                />
            </DataTable>

            <Dialog
                header="Rejection Reason"
                visible={noteDialogVisible}
                style={{ width: '25vw' }}
                onHide={() => setNoteDialogVisible(false)}
                className="confirm-dialog-custom"
            >
                <p>{selectedNote}</p>
            </Dialog>
        </div>
    );
};

export default MyComponents;