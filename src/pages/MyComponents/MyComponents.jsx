

import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './MyComponents.css'; 
import 'primeicons/primeicons.css'; 

const MyComponents = () => {
    const [selectedComponents, setSelectedComponents] = useState([]);
    const [selectedRequests, setSelectedRequests] = useState([]);

    const componentsData = [
        { id: 1, component: 'Microcontroller', purpose: 'For automation', receivedDate: '2023-01-10', returnDate: '2023-01-20' },
        { id: 2, component: 'Sensor', purpose: 'Temperature measurement', receivedDate: '2023-02-15', returnDate: '2023-02-25' },
        { id: 3, component: 'GPU', purpose: 'Graphics rendering', receivedDate: '2023-03-01', returnDate: '2023-03-10' },
        { id: 1, component: 'Microcontroller', purpose: 'For automation', receivedDate: '2023-01-10', returnDate: '2023-01-20' },
        { id: 2, component: 'Sensor', purpose: 'Temperature measurement', receivedDate: '2023-02-15', returnDate: '2023-02-25' },
        { id: 3, component: 'GPU', purpose: 'Graphics rendering', receivedDate: '2023-03-01', returnDate: '2023-03-10' },
        { id: 1, component: 'Microcontroller', purpose: 'For automation', receivedDate: '2023-01-10', returnDate: '2023-01-20' },
        { id: 2, component: 'Sensor', purpose: 'Temperature measurement', receivedDate: '2023-02-15', returnDate: '2023-02-25' },
        { id: 3, component: 'GPU', purpose: 'Graphics rendering', receivedDate: '2023-03-01', returnDate: '2023-03-10' },
    ];

    const requestsData = [
        { id: 1, component: 'Drone', requestStatus: 'Pending', purpose: 'Photography', date: '2023-04-01' },
        { id: 2, component: 'Microcontroller', requestStatus: 'Approved', purpose: 'Automation project', date: '2023-04-05' },
        { id: 3, component: 'Sensor', requestStatus: 'Rejected', purpose: 'Weather monitoring', date: '2023-04-10' },
        { id: 1, component: 'Drone', requestStatus: 'Pending', purpose: 'Photography', date: '2023-04-01' },
        { id: 2, component: 'Microcontroller', requestStatus: 'Approved', purpose: 'Automation project', date: '2023-04-05' },
        { id: 3, component: 'Sensor', requestStatus: 'Rejected', purpose: 'Weather monitoring', date: '2023-04-10' },
        { id: 1, component: 'Drone', requestStatus: 'Pending', purpose: 'Photography', date: '2023-04-01' },
        { id: 2, component: 'Microcontroller', requestStatus: 'Approved', purpose: 'Automation project', date: '2023-04-05' },
        { id: 3, component: 'Sensor', requestStatus: 'Rejected', purpose: 'Weather monitoring', date: '2023-04-10' },
    ];

    const renderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-pencil" 
                    className="p-button-text" 
                    onClick={() => handleEdit(rowData)} 
                />
                <Button 
                    icon="pi pi-trash" 
                    className="p-button-text" 
                    onClick={() => handleDelete(rowData)} 
                />
            </div>
        );
    };

    const handleEdit = (rowData) => {
        console.log(`Edit ${rowData.component}`);
        
    };

    const handleDelete = (rowData) => {
        console.log(`Delete ${rowData.component}`);
        
    };

    const onComponentSelect = (e) => {
        let selectedIds = [...selectedComponents];
        if (e.checked) {
            selectedIds.push(e.value);
        } else {
            selectedIds.splice(selectedIds.indexOf(e.value), 1);
        }
        setSelectedComponents(selectedIds);
    };

    const onRequestSelect = (e) => {
        let selectedIds = [...selectedRequests];
        if (e.checked) {
            selectedIds.push(e.value);
        } else {
            selectedIds.splice(selectedIds.indexOf(e.value), 1);
        }
        setSelectedRequests(selectedIds);
    };

    const toggleAllComponents = (e) => {
        if (e.checked) {
            setSelectedComponents(componentsData.map(item => item.id));
        } else {
            setSelectedComponents([]);
        }
    };

    const toggleAllRequests = (e) => {
        if (e.checked) {
            setSelectedRequests(requestsData.map(item => item.id));
        } else {
            setSelectedRequests([]);
        }
    };

    return (
        <div className="my-components">            
            <h2>Current Holdings</h2>
            <h4>Information about the components currently holding</h4>
            <DataTable value={componentsData} paginator rows={5} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            onChange={onComponentSelect} 
                            checked={selectedComponents.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" onChange={toggleAllComponents} checked={selectedComponents.length === componentsData.length} />} 
                />
                <Column field="component" header="Component" />
                <Column field="purpose" header="Purpose" />
                <Column field="receivedDate" header="Received Date" />
                <Column field="returnDate" header="Return Date" />
                <Column body={renderOptions} />
            </DataTable>

            <h2>Resource Requests</h2>
            <h4>All your past component log will be present here!</h4>
            <DataTable value={requestsData} paginator rows={5} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_req_${rowData.id}`} 
                            value={rowData.id} 
                            onChange={onRequestSelect} 
                            checked={selectedRequests.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all_req" onChange={toggleAllRequests} checked={selectedRequests.length === requestsData.length} />} 
                />
                <Column field="component" header="Component" />
                <Column field="requestStatus" header="Request Status" />
                <Column field="purpose" header="Purpose" />
                <Column field="date" header="Date" />
                <Column body={renderOptions} />
            </DataTable>
        </div>
    );
};

export default MyComponents;