import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import './Alerts.css';
import 'primeicons/primeicons.css';

const Alerts = () => {
    const [myAlerts, setMyAlerts] = useState([]);

    const alertsData = [
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
        { id: 1, component: 'Raspberry PI', generatedOn: '5-05-2024', alertLog: 'The component you requested for is currently under the control of another person, please wait in the reservation or else use the alternate component' },
    ];

    const renderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-times"
                    className="p-button-text" 
                    onClick={() => handleDelete(rowData)} 
                />
            </div>
        );
    };

    const handleDelete = (rowData) => {
        console.log(`Delete ${rowData.component}`);
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
            setMyAlerts(alertsData.map(item => item.id));
        } else {
            setMyAlerts([]);
        }
    };

    return (
        <div className="my-components">            
            <h2>Notification Center</h2>
            <h4>All the alert logs will be present here!</h4>
            <DataTable value={alertsData} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.id}`} 
                            value={rowData.id} 
                            onChange={onComponentSelect} 
                            checked={myAlerts.includes(rowData.id)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" onChange={toggleAllComponents} checked={myAlerts.length === alertsData.length} />} 
                />
                <Column field="component" header="Component" />
                <Column field="generatedOn" header="Generated On" />
                <Column field="alertLog" header="Alert Log" />
                <Column body={renderOptions} />
            </DataTable>
        </div>
    );
};

export default Alerts;