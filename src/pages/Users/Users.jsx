import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import './Users.css';
import 'primeicons/primeicons.css';

const Users = () => {
    const toast = useRef(null);
    const [myApprovals, setMyApprovals] = useState([]);
    const [availableLabs, setAvailableLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [usersData, setUsersData] = useState([]);

    useEffect(() => {
        fetchAvailableLabs();
        fetchUsersData();
    }, []);

    const fetchAvailableLabs = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/labs`);
            const data = await response.json();

            setAvailableLabs([{ name: 'No Lab Assigned', id: null }, ...data]);
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    };

    const fetchUsersData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users`);
            const data = await response.json();
            setUsersData(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const renderOptions = (rowData) => {
        return (
            <div>
                <Button 
                    icon="pi pi-pen-to-square"
                    className="p-button-text" 
                    onClick={() => openLabDialog(rowData)} 
                />
                <Button 
                    icon="pi pi-times"
                    className="p-button-text" 
                    onClick={() => handleDelete(rowData)}
                />
            </div>
        );
    };

    const openLabDialog = (rowData) => {
        setSelectedUser(rowData);
        setDisplayDialog(true); 
        setSelectedLab(null);
    };

    const handleAccept = async () => {
        try {
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users/${selectedUser.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ labInCharge: selectedLab ? selectedLab.name : null }),
            });

            setDisplayDialog(false);
            console.log(`Assigned ${selectedLab ? selectedLab.name : 'No Lab Assigned'} to ${selectedUser.fullName}`);
            fetchUsersData();

            toast.current.show({ severity: 'success', summary: 'Success', detail: `${selectedLab ? selectedLab.name : 'No Lab Assigned'} assigned to ${selectedUser.fullName}`, life: 3000 });
        } catch (error) {
            console.error('Error updating lab in charge:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to assign lab.', life: 3000 });
        }
    };

    const handleDelete = async (rowData) => {
        if (window.confirm(`Are you sure you want to delete ${rowData.fullName}?`)) {
            try {
                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users/${rowData.userId}`, { 
                    method: 'DELETE',
                });

                toast.current.show({ severity: 'success', summary: 'User Deleted', detail: `${rowData.fullName} has been deleted.`, life: 3000 });
                fetchUsersData();
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'There was an error deleting the user.', life: 3000 });
            }
        }
    };

    const onUserSelect = (e) => {
        let selectedIds = [...myApprovals];
        if (e.checked) {
            selectedIds.push(e.value);
        } else {
            selectedIds.splice(selectedIds.indexOf(e.value), 1);
        }
        setMyApprovals(selectedIds);
    };

    const toggleAllUsers = (e) => {
        if (e.checked) {
            setMyApprovals(usersData.map(item => item.userId));
        } else {
            setMyApprovals([]);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="current-users">            
            <Toast ref={toast} />
            <h2>Current Users</h2>
            <h4>All the registered users will be present here!</h4>
            <DataTable value={usersData} paginator rows={15} className="table-padding">
                <Column 
                    body={(rowData) => (
                        <Checkbox 
                            inputId={`cb_${rowData.userId}`} 
                            value={rowData.userId} 
                            onChange={onUserSelect} 
                            checked={myApprovals.includes(rowData.userId)} 
                        />
                    )} 
                    header={<Checkbox inputId="cb_all" onChange={toggleAllUsers} checked={myApprovals.length === usersData.length} />} 
                />
                <Column field="email" header="User Email ID" />
                <Column field="fullName" header="Name" />
                <Column field="labInCharge" header="Lab In Charge" />
                <Column field="createdAt" header="Registered On" body={(rowData) => formatDate(rowData.createdAt)} />
                <Column body={renderOptions} />
            </DataTable>

            <Dialog 
                visible={displayDialog} 
                onHide={() => setDisplayDialog(false)} 
                style={{ width: '20vw'}}
            >
                <div>
                    <label className="label" htmlFor="lab">{`${selectedUser ? selectedUser.fullName : ''}`}: </label>
                    <Dropdown 
                        id="lab"
                        value={selectedLab}
                        options={availableLabs} 
                        onChange={(e) => setSelectedLab(e.value)}
                        placeholder="Select a Lab"
                        className='dropdown'
                        optionLabel="name"
                    />
                </div>
                <Button label="Assign Lab" icon="pi pi-check" className="user-edit" onClick={handleAccept} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-secondary user-edit" />
            </Dialog>
        </div>
    );
};

export default Users;