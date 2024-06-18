// components/UserTable.js
import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, TextField, Typography, Box, Modal,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import styles from "./UserTable.module.css";

const initialUsers = [
    { id: 1, username: 'user1', email: 'user1@example.com', role: 'admin' },
    { id: 2, username: 'user2', email: 'user2@example.com', role: 'user' },
];


const UserTable = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [currentUser, setCurrentUser] = useState({
        id: '',
        username: '',
        email: '',
        role: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleOpenModal = (mode, user) => {
        setModalMode(mode);
        if (mode === 'edit' && user) {
            setCurrentUser(user);
        } else {
            setCurrentUser({ id: '', username: '', email: '', role: '' });
        }
        setErrors({});
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveUser = () => {
        const newErrors = {};
        if (!currentUser.username) newErrors.username = 'Username is required';
        if (!currentUser.email) newErrors.email = 'Email is required';
        if (!currentUser.role) newErrors.role = 'Role is required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (modalMode === 'add') {
            setUsers([...users, { ...currentUser, id: users.length + 1 }]);
        } else {
            setUsers(users.map(user => (user.id === currentUser.id ? currentUser : user)));
        }
        handleCloseModal();
    };

    const handleDeleteUser = (id) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="center" alignItems="center" p={2} sx={{}}>
                    <Typography variant="h5">User List</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <TextField
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        variant="outlined"
                        sx={{
                            height: '40px',
                            '& .MuiInputBase-root': { height: '100%' },
                            '& .MuiOutlinedInput-input': { padding: '10px 14px' }
                        }}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <Search />
                                </IconButton>
                            )
                        }}
                    />
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal('add')}>
                        Add User
                    </Button>
                </Box>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>#{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenModal('edit', user)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Modal open={openModal} onClose={handleCloseModal} className={styles.modal}
            >
                <Box
                    width={400}
                    bgcolor="background.paper"
                    p={4}
                    boxShadow={24}
                >
                    <Typography variant="h6" mb={2}>
                        {modalMode === 'add' ? 'Add User' : 'Edit User'}
                    </Typography>
                    {
                        modalMode === 'edit' &&
                        <TextField
                            label="ID"
                            value={currentUser.id}
                            onChange={(e) => setCurrentUser({ ...currentUser, id: e.target.value })}
                            fullWidth
                            margin="normal"
                            disabled={modalMode === 'edit'}
                        />
                    }

                    <TextField
                        label="Username"
                        value={currentUser.username}
                        onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                    <TextField
                        label="Email"
                        value={currentUser.email}
                        onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    {
                        modalMode == 'add' &&
                        <>
                            <TextField
                                label="Password"
                                value={currentUser.password}
                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="Confirm Password"
                                value={currentUser.confirmPassword}
                                onChange={(e) => setCurrentUser({ ...currentUser, confirmPassword: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </>
                    }
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={currentUser.role}
                            onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
                            label="Role"
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={handleCloseModal} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveUser} color="primary" variant="contained" style={{ marginLeft: '8px' }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default UserTable;
