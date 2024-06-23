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
import { IconButton, Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';
import ProblemModal from '@/components/problems/ProblemModal.jsx';

export default function CustomTable({ data, setData, admin }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const [currentProblem, setCurrentProblem] = useState({
        title: '',
        description: '',
        guide_input: '',
        guide_output: '',
        time_limit: '',
        memory_limit: '',
        categories: [],
        display_categories: ''
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

    const handleOpen = (problem = {}) => {
        setIsEditing(!!problem);
        setCurrentProblem(problem);
        setOpen(true);
    }

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
                                    <span className={styles.problem} onClick={() => handleProblemClick(row.contest.id, row.id)}>
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
                                        <IconButton color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="secondary" >
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
                selectedCategories={problem.categories}
                setSelectedCategories={setCategories}
            />
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

