import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import './Approval.css'; 
import 'primeicons/primeicons.css'; 

const Approval = () => {
    const [myApprovals, setMyApprovals] = useState([]);
    const [approvedReservations, setApprovedReservations] = useState([]);
    const [reservedReservations, setReservedReservations] = useState([]);
    const [otherReservations, setOtherReservations] = useState([]);
    const [rejectDialogVisible, setRejectDialogVisible] = useState(false);
    const [visibleConfirm, setVisibleConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');
    const toast = useRef(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const createNotification = async (userId, item, type) => {
        try {
            let notificationDetails;
            if (type === 'approved') {
                notificationDetails = {
                    user: item.userId._id,
                    component: item.component._id,
                    lab: item.labIdInCharge,
                    details: `${localStorage.getItem('fullName')} approved the request created for the ${item.component.name} component under the lab ${item.labInCharge} for ${item.userId.fullName}`
                };
            } else if (type === 'rejected') {
                notificationDetails = {
                    user: item.userId._id,
                    component: item.component._id,
                    lab: item.labIdInCharge,
                    details: `${localStorage.getItem('fullName')} rejected with a note for the request created for the component ${item.component.name} under the lab ${item.labInCharge} for ${item.userId.fullName}`
                };
            } else if (type === 'reserved') {
                notificationDetails = {
                    user: item.userId._id,
                    component: item.component._id,
                    lab: item.labIdInCharge,
                    details: `Less stock for the component ${item.component.name} under the lab ${item.labInCharge}, so reserved for the component based on the provided request given by ${item.userId.fullName}`
                };
            } else if (type === 'verification-approved') {
                notificationDetails = {
                    user: item.userId._id,
                    component: item.component._id,
                    lab: item.labIdInCharge,
                    details: `Verification completed by ${localStorage.getItem('fullName')} and approved for ${item.component.name} under the lab ${item.labInCharge} for the ${item.userId.fullName}`
                };
            } else if (type === 'verification-rejected') { 
                notificationDetails = {
                    user: item.userId._id,
                    component: item.component._id,
                    lab: item.labIdInCharge,
                    details: `Verification completed by ${localStorage.getItem('fullName')} and found issue for ${item.component.name} given to ${item.userId.fullName} under the lab ${item.labInCharge}, read the notes for more details`
                };
            }
    
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

    const fetchReservations = async () => {
        const labIdInCharge = localStorage.getItem('labIdInCharge');
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/?labId=${labIdInCharge}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            const data = await response.json();
            const approved = data.filter(request => (request.status === 'approved' || request.status === 'verification') && request.inHold === true);
            const reserved = data.filter(request => request.status === 'reserved');
            const others = data.filter(request => !(request.status === 'approved' || request.status === 'reserved' || request.status === 'rejected' || request.status === 'returned' || request.status === 'verification'));


            setApprovedReservations(approved);
            setReservedReservations(reserved)
            setOtherReservations(others);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const renderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-check"
                    className="p-button-text approval-icon" 
                    onClick={() => handleApprove(rowData)} 
                />
                <Button 
                    icon="pi pi-times"
                    className="p-button-text approval-icon" 
                    onClick={() => handleReject(rowData)} 
                />
            </div>
        );
    };

    const verificationRenderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-check"
                    className="p-button-text approval-icon" 
                    onClick={() => handleVerificationApprove(rowData)} 
                />
                <Button 
                    icon="pi pi-times"
                    className="p-button-text approval-icon" 
                    onClick={() => handleVerificationReject(rowData)} 
                />
            </div>
        );
    };

    const handleApprove = async (rowData) => {
        try {
            const quantityResponse = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components/quantity/${rowData.component._id}`);
            if (!quantityResponse.ok) {
                throw new Error('Failed to fetch component quantity');
            }

            const quantityData = await quantityResponse.json();
            if (quantityData.quantity > 0) {
                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components/${rowData.component._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ quantity: quantityData.quantity - 1 })
                });

                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${rowData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'approved', inHold: true })
                });

                toast.current.show({ severity: 'success', summary: 'Success', detail: `${rowData.component.name} approved!`, life: 3000 });
                console.log(`Approved ${rowData.component.name}`);
                fetchReservations();

                await createNotification(rowData.userId._id, rowData, 'approved');
            } else {
                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${rowData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'reserved' })
                });

                toast.current.show({ severity: 'warn', summary: 'Warning', detail: `Insufficient quantity for ${rowData.component.name}`, life: 3000 });
                fetchReservations();
                await createNotification(rowData.userId._id, rowData, 'reserved');
            }
        } catch (error) {
            console.error('Error approving reservation:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to approve ${rowData.component.name}`, life: 3000 });
        }
    };

    const rejectRequest = async () => {
        if (!rejectReason.trim()) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please provide a reason for rejection.', life: 3000 });
            return;
        }
    
        try {
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${selectedRow._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    status: 'rejected',
                    inHold: false,
                    notes: rejectReason,
                })
            });
    
            toast.current.show({ severity: 'success', summary: 'Success', detail: `${selectedRow.component.name} rejected!`, life: 3000 });
            fetchReservations(); // Refresh the data
            setRejectDialogVisible(false); // Close the dialog
            await createNotification(selectedRow.userId._id, selectedRow, 'rejected');
        } catch (error) {
            console.error('Error rejecting reservation:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to reject ${selectedRow.component.name}`, life: 3000 });
        }
    };
    
    // Update the handleReject function
    const handleReject = (rowData) => {
        confirmDialog({
            message: `Are you sure you want to reject the request for ${rowData.component.name}?`,
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setSelectedRow(rowData); // Store the selected row for later use
                setRejectDialogVisible(true); // Open the reason dialog
            }
        });
    };

    // const handleReject = (rowData) => {
    //     setSelectedRow(rowData);
    //     setRejectDialogVisible(true);
    // };



    const calculatePenalty = (returnDate) => {
        const currentDate = new Date();
        const returnDateObj = new Date(returnDate);
        const timeDiff = returnDateObj - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysDiff < 0 ? Math.abs(daysDiff) : 0;
    };

    const handleVerificationApprove = async (rowData) => {
        try {
            const quantityResponse = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components/quantity/${rowData.component._id}`);
            if (!quantityResponse.ok) {
                throw new Error('Failed to fetch component quantity');
            }
            const quantityData = await quantityResponse.json();
            console.log(quantityData)
            
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'returned', inHold: false, notes: '', penalizedAmount: calculatePenalty(rowData.toDate) })
            });

            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/components/${rowData.component._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: quantityData.quantity + 1 })
            });

            toast.current.show({ severity: 'success', summary: 'Success', detail: `${rowData.component.name} returned successfully!`, life: 3000 });
            fetchReservations(); 
            console.log('verification approved')
            await createNotification(rowData.userId._id, rowData, 'verification-approved');

        } catch (error) {
            console.error('Error approving verification:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to return ${rowData.component.name}`, life: 3000 });
        }
    };


    const handleVerificationReject = async (rowData) => {
        try {
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${rowData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: 'returned', inHold: false, notes: 'damaged', penalizedAmount: calculatePenalty(rowData.toDate) })
            });

            toast.current.show({ severity: 'warn', summary: 'Issue', detail: `${rowData.component.name} have some damages!`, life: 3000 });
            fetchReservations(); 
            await createNotification(rowData.userId._id, rowData, 'verification-rejected');
        } catch (error) {
            console.error('Error approving verification:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to return ${rowData.component.name}`, life: 3000 });
        }
    };

    return (
        <div className="my-components">            
            <h2>Approve Requests</h2>
            <p className="rrs-table-label">All your assigned request status will be present here!</p>
            <DataTable value={otherReservations} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            checked={myApprovals.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" checked={myApprovals.length === otherReservations.length} />} 
                />
                <Column field="component.name" header="Component" />
                <Column field="userId.fullName" header="Requested By" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" body={(rowData) => formatDate(rowData.fromDate)} />
                <Column field="toDate" header="To Date" body={(rowData) => formatDate(rowData.toDate)} />
                <Column field="createdAt" header="Booking Date" body={(rowData) => formatDate(rowData.createdAt)} />
                <Column header="Actions" body={renderOptions} />
            </DataTable>

            <h2>Current Custodians</h2>
            <p className="rrs-table-label">All the component custodians details will be present here!</p>
            <DataTable value={approvedReservations} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            checked={myApprovals.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all_approved" checked={myApprovals.length === approvedReservations.length} />} 
                />
                <Column field="component.name" header="Component" />
                <Column field="userId.fullName" header="Holded By" />
                <Column field="userId.email" header="Email ID" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" body={(rowData) => formatDate(rowData.fromDate)} />
                <Column field="toDate" header="To Date" body={(rowData) => formatDate(rowData.toDate)} />
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
                <Column header="Actions" body={(rowData) =>
                    rowData.component && rowData.notes === 'in verification' ? verificationRenderOptions(rowData) : null
                } />
            </DataTable>



            <h2>Reserved Components</h2>
            <p className="rrs-table-label">All the components reserved for custodians will be present here!</p>
            <DataTable value={reservedReservations} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            checked={myApprovals.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all_approved" checked={myApprovals.length === approvedReservations.length} />} 
                />
                <Column field="component.name" header="Component" />
                <Column field="userId.fullName" header="Reserved By" />
                <Column field="userId.email" header="Email ID" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" body={(rowData) => formatDate(rowData.fromDate)} />
                <Column field="toDate" header="To Date" body={(rowData) => formatDate(rowData.toDate)} />
                <Column field="component.quantity" header="Current Component Quantity" />
                <Column header="Actions" body={(rowData) =>
                    rowData.component && rowData.component.quantity > 0 ? renderOptions(rowData) : null
                } />
            </DataTable>

            <Toast ref={toast} />

            <ConfirmDialog 
                visible={visibleConfirm} 
                onHide={() => setVisibleConfirm(false)} 
                message={confirmMessage}
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={() => console.log('Confirmed')}
                reject={() => setVisibleConfirm(false)}
                className="confirm-dialog-custom"
            />

            <Dialog
                header="Provide Rejection Reason"
                visible={rejectDialogVisible}
                style={{ width: '25vw' }}
                onHide={() => setRejectDialogVisible(false)}
                footer={
                    <div>
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text reject-cancel" onClick={() => setRejectDialogVisible(false)} />
                        <Button label="Submit" icon="pi pi-check" className="p-button-text reject-proceed" onClick={rejectRequest} />
                    </div>
                }
                className="confirm-dialog-custom"
            >
                <div className="field">
                    <div htmlFor="rejectReason">Reason</div>
                    <InputTextarea
                        id="rejectReason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={5}
                        cols={37}
                        autoResize
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default Approval;