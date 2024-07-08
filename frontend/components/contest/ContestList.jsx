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
import styles from "./ContestTable.module.css";
import { useSelector } from 'react-redux';
import { userIdSelector, userNameSelector } from "@/redux/reducers/user.reducer";
import contestService from '@/services/contest.service';

const offset = -new Date().getTimezoneOffset() / 60;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function hasRegistered(contestants, userId) {
    if (contestants && contestants.find(contestant => contestant.user_id == userId)) {
        return true;
    }
    return false;
}

const ContestList = ({ updateContestContestants, contests, type }) => {
    const router = useRouter();

    const userId = useSelector(userIdSelector);
    const userName = useSelector(userNameSelector);

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

    const handleRankingClick = (id) => {
        router.push(`/contests/${id}/rankings`);
    }

    const toggleRegister = async (contestants, contestId) => {
        try {
            const info = {
                user_id: userId,
                user_name: userName,
                contest_id: contestId
            }
            let newContestants = contestants;
            if (contestants && contestants.find(contestant => contestant.user_id == userId)) {
                const res = await contestService.unregisterContest(info);
                if (res.status != 200) {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Unregister failed');
                }
                else {
                    newContestants = contestants.filter((contestant) => {
                        contestant.user_id != userId
                    })
                    updateContestContestants(contestId, newContestants);
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Unregistered successfully');
                }
            }
            else {
                const res = await contestService.registerContest(info);
                if (res.status != 200) {
                    setSnackbarSeverity('error');
                    setSnackbarMessage('Register failed');
                }
                else {
                    const { contestant } = await res.json();
                    newContestants = [...contestants, contestant];
                    console.log('newContestants', newContestants);
                    updateContestContestants(contestId, newContestants);
                    setSnackbarSeverity('success');
                    setSnackbarMessage('Registered successfully');
                }
            }
        }
        catch (e) {
            console.log("ERROR", e);
        }
        setSnackbarOpen(true);
    };

    return (
        <>
            <TableContainer component={Paper} style={{ marginTop: 20 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell></TableCell>
                            <TableCell>Participants</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredContests.map((contest) => (
                            <TableRow key={contest.id}>
                                <TableCell>
                                    <Link sx={{ cursor: 'pointer' }}>
                                        {
                                            type == "ongoing" ? "Participate" : null
                                        }
                                        {
                                            type == "upcoming" ? <span onClick={() => toggleRegister(contest?.user_contests, contest.id)}>
                                                {hasRegistered(contest?.user_contests, userId) ? "Unregister" : "Register"}
                                            </span>
                                                : null
                                        }
                                        {
                                            type == "ended" ?
                                                <span onClick={() => handleIdClick(contest.id)}>
                                                    Enter
                                                </span>
                                                : null
                                        }
                                    </Link>
                                </TableCell>
                                <TableCell>{contest.name}</TableCell>
                                <TableCell>
                                    <div className={styles.dateTime}>
                                        {contest.display_start}
                                        <span className={styles.utc}>{`UTC+${offset}`}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={styles.dateTime}>
                                        {contest.display_end}
                                        <span className={styles.utc}>{`UTC+${offset}`}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link sx={{ cursor: 'pointer' }} onClick={() => handleRankingClick(contest.id)}>
                                        Final standings
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <span>{contest?.user_contests?.length}</span>
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

