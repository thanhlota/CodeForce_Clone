import React, { useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Button, TextField, Typography, Box, Modal,
    FormControl, InputLabel, Select, MenuItem,
    Snackbar, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import { Add, Delete, Edit, Search } from '@mui/icons-material';
import UserService from '@/services/user.service';
import styles from "./UserTable.module.css";

const UserTable = ({ users, setUsers, accessToken }) => {
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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const handleOpenDeleteDialog = (id) => {
        setDeleteUserId(id);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
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

    const handleAddUser = useCallback(async (userInfo) => {
        try {
            const res = await UserService.addUser(accessToken, userInfo);
            if (!res.newUser) {
                setSnackbarMessage(res.message);
                setSnackbarSeverity('error');
                return;
            }
            else {
                setSnackbarMessage('User added successfully!');
                setSnackbarSeverity('success');
            }
            setSnackbarOpen(true);
            return res;
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage('Failed to add user.');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        return null;

    }, [accessToken]);

    const handleUpdateUser = useCallback(async (userInfo) => {
        try {
            const res = await UserService.updateUser(accessToken, userInfo);
            if (!res.updateUser) {
                setSnackbarMessage(res.message);
                setSnackbarSeverity('error');
                return;
            }
            else {
                setSnackbarMessage('User updated successfully!');
                setSnackbarSeverity('success');
            }
            setSnackbarOpen(true);
            return res;
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage('Failed to update user');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        return null;
    }, [accessToken]);

    const handleSaveUser = async () => {
        const newErrors = {};
        if (!currentUser.username) newErrors.username = 'Username is required';
        if (!currentUser.email) newErrors.email = 'Email is required';
        if (!currentUser.role) newErrors.role = 'Role is required';
        if (modalMode === 'add' && !currentUser.password) newErrors.password = 'Password is required';
        if (modalMode === 'add' && !currentUser.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        if (currentUser.password !== currentUser.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (modalMode === 'add') {
            const res = await handleAddUser(currentUser);
            if (res && res.newUser) {
                setUsers([...users, { ...res.newUser }]);
            }
        } else {
            const res = await handleUpdateUser(currentUser);
            if (res && res.updateUser) {
                setUsers(users.map(user => (user.id === currentUser.id ? currentUser : user)));
            }
        }
        handleCloseModal();
    };

    const handleDeleteUser = async () => {
        try {
            const res = await UserService.deleteUser(accessToken, deleteUserId);
            setUsers(users.filter(user => user.id !== deleteUserId));
            setSnackbarMessage('User removed successfully!');
            setSnackbarSeverity('success');
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage('Failed to delete user');
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
        handleCloseDeleteDialog();
    };

    const filteredUsers = users ? users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

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
                                    <IconButton onClick={() => handleOpenDeleteDialog(user.id)}>
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
                                type="password"
                                onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                                fullWidth
                                margin="normal"
                                error={!!errors.password}
                                helperText={errors.password}
                            />
                            <TextField
                                label="Confirm Password"
                                value={currentUser.confirmPassword}
                                type="password"
                                onChange={(e) => setCurrentUser({ ...currentUser, confirmPassword: e.target.value })}
                                fullWidth
                                margin="normal"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
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
                        {errors.role && <Typography color="error">{errors.role}</Typography>}
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
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this user?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteUser} color="primary" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default UserTable;

