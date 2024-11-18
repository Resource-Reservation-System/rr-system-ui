import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import './MyComponents.css'; 
import 'primeicons/primeicons.css'; 

const MyComponents = () => {
    const [approvedRequests, setApprovedRequests] = useState([]);
    const [otherRequests, setOtherRequests] = useState([]);
    const toast = useRef(null);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchUserRequests();
    }, []);

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

            const approved = data.filter(request => request.status === 'Approved' && request.inHold === true);
            const others = data.filter(request => !(request.status === 'Approved'));

            setApprovedRequests(approved);
            setOtherRequests(others);
        } catch (error) {
            console.error('Error fetching user requests:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load requests.', life: 3000 });
        }
    };

    return (
        <div className="my-components">            
            <h2>Current Holdings</h2>
            <h4>Information about the components currently holding</h4>
            <DataTable value={approvedRequests} paginator rows={5} className="table-padding">
                <Column field="component.name" header="Component" />
                <Column field="purpose" header="Purpose" />
                <Column field="fromDate" header="From Date" />
                <Column field="toDate" header="To Date" />
                <Column body={(rowData) => (
                    <div>
                        <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-text" onClick={() => handleDelete(rowData)} />
                    </div>
                )} header="Actions" />
            </DataTable>

            <h2>Resource Requests</h2>
            <h4>All your past component log will be present here!</h4>
            <DataTable value={otherRequests} paginator rows={5} className="table-padding">
                <Column field="component.name" header="Component" />
                <Column field="status" header="Request Status" />
                <Column field="purpose" header="Purpose" />
                <Column field="createdAt" header="Date" />
                <Column body={(rowData) => (
                    <div>
                        <Button icon="pi pi-pencil" className="p-button-text" onClick={() => handleEdit(rowData)} />
                        <Button icon="pi pi-trash" className="p-button-text" onClick={() => handleDelete(rowData)} />
                    </div>
                )} header="Actions" />
            </DataTable>

            <Toast ref={toast} />
        </div>
    );
};

export default MyComponents;