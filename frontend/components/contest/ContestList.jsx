import React, { useState } from 'react';
import {
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Snackbar,
    Link
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useRouter } from 'next/router';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ContestList = ({ contests, type }) => {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const filteredContests = contests ? contests.filter((contest) =>
        contest.name.toLowerCase().includes(searchTerm.toLowerCase())
        || contest.state.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleIdClick = (id) => {
        router.push(`/contests/${id}`);
    }

    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContests.map((contest) => (
                            <TableRow key={contest.id}>
                                <TableCell>
                                    <Link sx={{ cursor: 'pointer' }} onClick={() => handleIdClick(contest.id)}>
                                        #{contest.id}
                                    </Link>
                                </TableCell>
                                <TableCell>{contest.name}</TableCell>
                                <TableCell>{contest.start_time}</TableCell>
                                <TableCell>{contest.end_time}</TableCell>
                                <TableCell>
                                    <Link sx={{ cursor: 'pointer' }} onClick={() => handleIdClick(contest.id)}>
                                        {
                                            type == "ongoing" ? "Participate" : null
                                        }
                                        {
                                            type == "upcoming" ? "Register" : null
                                        }
                                        {
                                            type == "ended" ? "Enter" : null
                                        }
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ContestList;

