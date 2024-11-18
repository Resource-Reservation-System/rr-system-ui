import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './Approval.css';
import 'primeicons/primeicons.css';

const Approval = () => {
    const [myApprovals, setMyApprovals] = useState([]);
    const [reservations, setReservations] = useState([]); // State for reservations

    useEffect(() => {
        fetchReservations(); // Fetch reservations on mount
    }, []);

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
            setReservations(data); // Set fetched reservations to state
        } catch (error) {
            console.error('Error fetching reservations:', error);
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

    const handleApprove = (rowData) => {
        console.log(`Approved ${rowData.component}`);
        // Implement approve logic here
    };

    const handleReject = (rowData) => {
        console.log(`Rejected ${rowData.component}`);
        // Implement reject logic here
    };

    const onComponentSelect = (e) => {
        let selectedIds = [...myApprovals];
        if (e.checked) {
            selectedIds.push(e.value);
        } else {
            selectedIds.splice(selectedIds.indexOf(e.value), 1);
        }
        setMyApprovals(selectedIds);
    };

    const toggleAllComponents = (e) => {
        if (e.checked) {
            setMyApprovals(reservations.map(item => item.id)); // Use id for selection
        } else {
            setMyApprovals([]);
        }
    };

    return (
        <div className="my-components">            
            <h2>Approve/Reject Requests</h2>
            <h4>All your request status will be present here!</h4>
            <DataTable value={reservations} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            onChange={onComponentSelect} 
                            checked={myApprovals.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" onChange={toggleAllComponents} checked={myApprovals.length === reservations.length} />} 
                />
                <Column field="component.name" header="Component" />
                <Column field="userId.fullName" header="Requested By" />
                <Column field="purpose" header="Purpose" />
                <Column field="createdAt" header="Booking Date" />
                <Column body={renderOptions} />
            </DataTable>
        </div>
    );
};

export default Approval;