import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './Approval.css';
import 'primeicons/primeicons.css';

const Approval = () => {
    const [myApprovals, setMyApprovals] = useState([]);

    const alertsData = [
        { id: 1, component: 'Raspberry PI', student: "Jimmy", purpose: "Internal Project", bookingDate: "5-05-2024" },
        { id: 3, component: '3D Printer', student: "Bob", purpose: "Research", bookingDate: "20-06-2024" },
        { id: 4, component: 'VR Headset', student: "Charlie", purpose: "Testing", bookingDate: "15-07-2024" },
        { id: 5, component: 'Raspberry Pi', student: "David", purpose: "Learning", bookingDate: "22-07-2024" },
        { id: 6, component: 'Laptop', student: "Eva", purpose: "Programming", bookingDate: "10-08-2024" },
        { id: 7, component: 'Arduino', student: "Frank", purpose: "Prototype", bookingDate: "05-09-2024" },
        { id: 8, component: '3D Printer', student: "Grace", purpose: "Design", bookingDate: "18-09-2024" },
        { id: 9, component: 'Raspberry Pi', student: "Henry", purpose: "Project Testing", bookingDate: "10-10-2024" },
        { id: 10, component: 'VR Headset', student: "Ivy", purpose: "Simulation", bookingDate: "01-11-2024" },
        { id: 11, component: 'Laptop', student: "Jack", purpose: "Development", bookingDate: "12-11-2024" }
    ];

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
        console.log(`Delete ${rowData.component}`);
        // Implement delete logic here
    };

    const handleReject = (rowData) => {
        console.log(`Delete ${rowData.component}`);
        // Implement delete logic here
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
            setMyApprovals(alertsData.map(item => item.id));
        } else {
            setMyApprovals([]);
        }
    };

    return (
        <div className="my-components">            
            <h2>Approve/Reject Requests</h2>
            <h4>All your request status will be present here!</h4>
            <DataTable value={alertsData} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            onChange={onComponentSelect} 
                            checked={myApprovals.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" onChange={toggleAllComponents} checked={myApprovals.length === alertsData.length} />} 
                />
                <Column field="component" header="Component" />
                <Column field="student" header="Requested By" />
                <Column field="purpose" header="Purpose" />
                <Column field="bookingDate" header="Booking Date" />
                <Column body={renderOptions} />
            </DataTable>
        </div>
    );
};

export default Approval;