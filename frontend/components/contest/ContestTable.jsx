// src/App.js
import React, { useState } from 'react';
import {
    Typography,
    Button,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Box,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import MuiAlert from '@mui/material/Alert';
import contestService from '@/services/contest.service';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ContestTable = ({ contests, setContests }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [currentContest, setCurrentContest] = useState({ id: '', name: '', start_time: '', end_time: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const filteredContests = contests ? contests.filter((contest) =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleOpen = (contest = { id: '', name: '', start_time: '', end_time: '' }) => {
        setIsEditing(!!contest.id);
        setCurrentContest(contest);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentContest((prev) => ({ ...prev, [name]: value }));
    };

    const getState = (start_time, end_time) => {
        const now = new Date();
        const startTime = new Date(start_time);
        const endTime = new Date(end_time);
        if (now < startTime) return 'upcoming';
        if (now > endTime) return 'end';
        return 'ongoing';
    };

    const validate = () => {
        let tempErrors = {};
        if (!currentContest.name) tempErrors.name = 'Contest name is required';
        if (!currentContest.start_time) tempErrors.start_time = 'Start time is required';
        if (!currentContest.end_time) tempErrors.end_time = 'End time is required';
        if (currentContest.start_time && currentContest.end_time && currentContest.start_time > currentContest.end_time)
            tempErrors.end_time = 'Start time cannot bigger than end time';
        return tempErrors;
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const date = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${date}T${hours}:${minutes}`;
    };

    const minDateTime = getCurrentDateTime();

    const getColor = (state) => {
        switch (state) {
            case 'upcoming':
                return 'yellow';
            case 'ongoing':
                return 'green';
            case 'end':
                return 'red';
            default:
                return 'grey';
        }
    };

    const handleAdd = async () => {
        try {
            setLoading(true);
            const res = await contestService.addContest(currentContest);
            if (res.status != 200) {
                setSnackbarMessage(res.message);
                setSnackbarSeverity('error');
            }
            else {
                const { contest } = await res.json();
                setContests((prev) => [
                    ...prev,
                    { ...contest, state: getState(contest.start_time, contest.end_time) },
                ]);
                setSnackbarMessage("Contest added successfully!");
                setSnackbarSeverity('success');
                handleClose();
            }
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage("INTERNAL SERVER ERROR");
            setSnackbarSeverity('error');
        }
        setLoading(false);
        setSnackbarOpen(true);
    }

    const handleUpdate = async () => {
        try {

        }
        catch (e) {
            console.log("ERROR", e);
        }
    }

    const handleSave = () => {
        const tempErrors = validate();


        if (Object.keys(tempErrors).length !== 0) {
            setErrors(tempErrors);
            return;
        }

        if (isEditing) {
            handleUpdate();
            // setContests((prev) =>
            //     prev.map((contest) =>
            //         contest.id === currentContest.id ? { ...currentContest, state: getState(currentContest.start_time, currentContest.end_time) } : contest
            //     )
            // );
        } else {
            handleAdd();
        }
    };

    const handleDelete = (id) => {
        setContests((prev) => prev.filter((contest) => contest.id !== id));
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Box display="flex" justifyContent="center" alignItems="center" p={2} sx={{}}>
                    <Typography variant="h5">Contest List</Typography>
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
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                        Add Contest
                    </Button>
                </Box>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContests.map((contest) => (
                            <TableRow key={contest.id}>
                                <TableCell>{contest.id}</TableCell>
                                <TableCell>{contest.name}</TableCell>
                                <TableCell>{contest.start_time}</TableCell>
                                <TableCell>{contest.end_time}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <Box
                                            component="span"
                                            width={20}
                                            height={20}
                                            borderRadius="50%"
                                            marginRight={1}
                                            bgcolor={getColor(contest.state)}
                                        />
                                        {contest.state}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleOpen(contest)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="secondary" onClick={() => handleDelete(contest.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? 'Edit Contest' : 'Add Contest'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>To add or edit a contest, please fill out the form below.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Contest Name"
                        type="text"
                        fullWidth
                        value={currentContest.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="start_time"
                        label="Start Time"
                        type="datetime-local"
                        fullWidth
                        value={currentContest.start_time}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.start_time}
                        helperText={errors.start_time}
                        inputProps={{ min: minDateTime }}
                        required
                    />
                    <TextField
                        margin="dense"
                        name="end_time"
                        label="End Time"
                        type="datetime-local"
                        fullWidth
                        value={currentContest.end_time}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.end_time}
                        helperText={errors.end_time}
                        inputProps={{ min: minDateTime }}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ContestTable;
