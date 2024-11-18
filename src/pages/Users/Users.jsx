import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Import Toast
import './Users.css';
import 'primeicons/primeicons.css';

const Users = () => {
    const toast = useRef(null); // Create a reference for the toast component
    const [myApprovals, setMyApprovals] = useState([]);
    const [availableLabs, setAvailableLabs] = useState([]);
    const [selectedLab, setSelectedLab] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [displayDialog, setDisplayDialog] = useState(false);
    const [usersData, setUsersData] = useState([]); // State to hold user data

    useEffect(() => {
        fetchAvailableLabs();
        fetchUsersData(); // Fetch users data when component mounts
    }, []);

    const fetchAvailableLabs = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/labs`);
            const data = await response.json();
            console.log(data)
            // Add an option for resetting lab assignment
            setAvailableLabs([{ name: 'No Lab Assigned', id: null }, ...data]); // Assuming each lab has a name and id property
        } catch (error) {
            console.error('Error fetching labs:', error);
        }
    };

    const fetchUsersData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users`);
            const data = await response.json();
            setUsersData(data); // Set the fetched user data
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
                    onClick={() => handleDelete(rowData)} // Call delete function
                />
            </div>
        );
    };

    const openLabDialog = (rowData) => {
        setSelectedUser(rowData); // Set the user for whom lab is being assigned
        setDisplayDialog(true); // Show the dialog
        setSelectedLab(null); // Reset selected lab
    };

    const handleAccept = async () => {
        if (!selectedLab) {
            alert('Please select a lab');
            return;
        }

        try {
            console.log("selected lab")
            console.log(selectedLab)
            console.log("selected user")
            console.log(selectedUser)
            // Prepare data for updating user
            const updatedData = { 
                labInCharge: selectedLab ? selectedLab.name : null,
                labIdInCharge: selectedLab ? selectedLab._id : null, // Store lab ID
                role: selectedLab && selectedLab._id !== null ? 'staff' : selectedUser.role // Update role to staff if a valid lab is assigned
            };

            // Update labInCharge and role for the selected user
            await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users/${selectedUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData), // Send updated data
            });

            // Close dialog and refresh data if necessary
            setDisplayDialog(false);
            console.log(`Assigned ${selectedLab ? selectedLab.name : 'No Lab Assigned'} to ${selectedUser.fullName}`);
            fetchUsersData(); // Refresh user data after assignment

            toast.current.show({ severity: 'success', summary: 'Success', detail: `${selectedLab ? selectedLab.name : 'No Lab Assigned'} assigned to ${selectedUser.fullName}`, life: 3000 });
        } catch (error) {
            console.error('Error updating lab in charge:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to assign lab.', life: 3000 });
        }
    };

    const handleDelete = async (rowData) => {
        console.log(rowData);
        if (window.confirm(`Are you sure you want to delete ${rowData.fullName}?`)) {
            try {
                await fetch(`${import.meta.env.VITE_SERVICE_URL}/api/users/${rowData._id}`, { // Use userId for DELETE request
                    method: 'DELETE',
                });

                toast.current.show({ severity: 'success', summary: 'User Deleted', detail: `${rowData.fullName} has been deleted.`, life: 3000 }); // Show success notification
                fetchUsersData(); // Refresh user data after deletion
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'There was an error deleting the user.', life: 3000 }); // Show error notification
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
            setMyApprovals(usersData.map(item => item.userId)); // Use userId for selection
        } else {
            setMyApprovals([]);
        }
    };

    // Function to format registered date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="current-users">            
            <Toast ref={toast} /> {/* Add Toast component */}
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

            {/* Dialog for selecting lab */}
            <Dialog 
                visible={displayDialog} 
                onHide={() => setDisplayDialog(false)} 
                style={{ width: '20vw'}} // Adjust width as needed
            >
                <div>
                    <label className="label" htmlFor="lab">{`${selectedUser ? selectedUser.fullName : ''}`}: </label>
                    <Dropdown 
                        id="lab"
                        value={selectedLab}
                        options={availableLabs} // Array of labs fetched from API
                        onChange={(e) => setSelectedLab(e.value)}
                        placeholder="Select a Lab"
                        className='dropdown'
                        optionLabel="name" // Adjust based on your data structure
                    />
                </div>
                <Button label="Assign Lab" icon="pi pi-check" className="user-edit" onClick={handleAccept} />
                <Button label="Cancel" icon="pi pi-times" onClick={() => setDisplayDialog(false)} className="p-button-secondary user-edit" />
            </Dialog>
        </div>
    );
};

export default Users;