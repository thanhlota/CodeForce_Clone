import React, { useState, useCallback } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import styles from './ProblemList.module.css';
import { useRouter } from 'next/router';
import {
    IconButton,
    Box,
    Typography,
    Button,
    Snackbar,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import ProblemModal from '@/components/problems/ProblemModal.jsx';
import problemService from "@/services/problem.service";

export default function CustomTable({ data, setData, admin }) {
    const router = useRouter();
    const { contestId } = router.query;
    const [searchTerm, setSearchTerm] = useState('');
    const contestName = data?.length ? data[0].contest.name : null;
    const [currentProblem, setCurrentProblem] = useState({
        id: '',
        contest_id: '',
        title: '',
        description: '',
        guide_input: '',
        guide_output: '',
        time_limit: '',
        memory_limit: '',
        categories: [],
        display_categories: '',
        testcases: []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteProblemId, setDeleteProblemId] = useState(null);
    const [open, setOpen] = useState(false);

    const setCategories = (newCategories) => {
        setCurrentProblem((prev) => ({
            ...prev,
            categories: newCategories
        }));
    };

    const setTestcases = (newTestcases) => {
        setCurrentProblem((prev) => ({
            ...prev,
            testcases: newTestcases
        }))
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const filteredData = data ? data.filter((row) =>
        row.title.toLowerCase().includes(searchTerm.toLowerCase())
        || row.categories.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleProblemClick = useCallback((contestId, problemId) => {
        router.push(`/contests/${contestId}/problem/${problemId}`);
    }, []);

    const handleOpen = (problem = { contest_id: contestId, contest: { name: contestName } }) => {
        setIsEditing(!!problem.id);
        setCurrentProblem(problem);
        setOpen(true);
    }

    const handleAdd = async () => {
        try {
            const res = await problemService.addProblem(currentProblem);
            if (res.status == 200) {
                const { problem } = await res.json();
                setSnackbarMessage("Problem added successfully!");
                setSnackbarSeverity('success');
                setData((prev) => [
                    ...prev,
                    { ...currentProblem, display_categories: currentProblem.categories.join(", "), id: problem.id },
                ]);
                handleClose();
            }
            else {
                setSnackbarMessage("Problem added failed!");
                setSnackbarSeverity('error');
            }
        }
        catch (e) {
            setSnackbarMessage("Problem added failed!");
            setSnackbarSeverity('error');
        }
        setSnackbarOpen(true);
    }

    const handleUpdate = async (problemId) => {
        router.push(`/admin/contest/${contestId}/problem/${problemId}`)
    }

    const handleSubmit = async () => {
        if (!isEditing) {
            await handleAdd();
        }
        else await handleUpdate();
    };

    const handleDeleteProblem = async () => {
        try {
            setLoading(true);
            await problemService.deleteProblem(deleteProblemId);
            setData(data.filter(problem => problem.id !== deleteProblemId));
            setSnackbarMessage('Problem removed successfully!');
            setSnackbarSeverity('success');
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage('Failed to delete problem');
            setSnackbarSeverity('error');
        }
        setLoading(false);
        handleCloseDeleteDialog();
        setSnackbarOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleOpenDeleteDialog = (id) => {
        setDeleteProblemId(id);
        setOpenDeleteDialog(true);
    };


    return (
        <div className={styles.custom_table}>
            <TableContainer component={Paper}>
                <Box display="flex" justifyContent="center" alignItems="center" p={2} sx={{}}>
                    <Typography variant="h5">Problem List</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                    <TextField
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    {admin
                        && <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpen()}>
                            Add Problem
                        </Button>
                    }

                </Box>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                        <TableRow className={styles.table_row} >
                            <TableCell className={styles.table_header}>Problem Name</TableCell>
                            <TableCell align="right" className={styles.table_header}>Category</TableCell>
                            <TableCell align="right" className={styles.table_header}>Contest Name</TableCell>
                            {admin && <TableCell align="right">Actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'inherit' }}
                                className={styles.table_row}
                            >
                                <TableCell className={styles.custom_cell}>
                                    <span className={styles.problem} onClick={() => handleProblemClick(row.contest_id, row.id)}>
                                        {row.title}
                                    </span>
                                    <div className={styles.limit_container}>
                                        <span>standard input/output</span>
                                        <span styles={styles.limit}>{row.limit}</span>
                                    </div>
                                </TableCell>
                                <TableCell align="right" className={styles.category}>{row.display_categories}</TableCell>
                                <TableCell align="right" className={styles.contest}>{row.contest.name}</TableCell>
                                {admin &&
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => handleUpdate(row.id)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(row.id)} >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ProblemModal
                isEditing={isEditing}
                open={open}
                handleClose={handleClose}
                problem={currentProblem}
                setProblem={setCurrentProblem}
                selectedCategories={currentProblem.categories ? currentProblem.categories : []}
                setSelectedCategories={setCategories}
                testcases={currentProblem.testcases ? currentProblem.testcases : []}
                setTestcases={setTestcases}
                handleSubmit={handleSubmit}
            />
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Delete Problem</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this problem?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProblem} color="primary" variant="contained" autoFocus
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

