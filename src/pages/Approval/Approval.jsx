import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './Approval.css'; 
import 'primeicons/primeicons.css'; 

const Approval = () => {
    const [myApprovals, setMyApprovals] = useState([]);
    const [approvedReservations, setApprovedReservations] = useState([]);
    const [otherReservations, setOtherReservations] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        fetchReservations();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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
            const approved = data.filter(request => request.status === 'approved' && request.inHold === true);
            const others = data.filter(request => !(request.status === 'approved' && request.inHold === true));

            setApprovedReservations(approved);
            setOtherReservations(others);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load reservations.', life: 3000 });
        }
    };

    const renderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-check"
                    className="p-button-text" 
                    onClick={() => handleApprove(rowData)} 
                />
                <Button 
                    icon="pi pi-times"
                    className="p-button-text" 
                    onClick={() => handleReject(rowData)} 
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
            } else {
                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/requests/${rowData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: 'Reserved' })
                });

                toast.current.show({ severity: 'warn', summary: 'Warning', detail: `Insufficient quantity for ${rowData.component.name}`, life: 3000 });
            }
        } catch (error) {
            console.error('Error approving reservation:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: `Failed to approve ${rowData.component.name}`, life: 3000 });
        }
    };

    const handleReject = (rowData) => {
        console.log(`Rejected ${rowData.component.name}`);
        // Implement reject logic here
    };


    const calculatePenalty = (returnDate) => {
        const currentDate = new Date();
        const returnDateObj = new Date(returnDate);
        const timeDiff = returnDateObj - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysDiff < 0 ? Math.abs(daysDiff) : 0;
    };

    return (
        <div className="my-components">            
            <h2>Approve Requests</h2>
            <h4>All your assigned request status will be present here!</h4>
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
                <Column body={renderOptions} />
            </DataTable>

            <h2>Current Custodians</h2>
            <h4>All the component custodians details will be present here!</h4>
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
                <Column field="penalty" header="Penalty (in ₹)" body={(rowData) => calculatePenalty(rowData.toDate)}/>
            </DataTable>

            <Toast ref={toast} />
        </div>
    );
};

export default Approval;