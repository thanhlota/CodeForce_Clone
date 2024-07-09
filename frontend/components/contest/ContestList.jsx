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
import React, { useState, useEffect } from "react"
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

function ContestRow({ type, contest, handleRankingClick, handleIdClick, toggleRegister, updateContestState }) {
    const contestStartTime = new Date(contest.display_start);
    const contestEndTime = new Date(contest.display_end);

    const [countdown, setCountdown] = useState('');

    useEffect(() => {
        if (type == "upcoming") {
            const intervalId = setInterval(updateCountdown, 1000);
            function updateCountdown() {
                const currentTime = new Date();
                const timeDifference = contestStartTime - currentTime;
                if (timeDifference > 0) {
                    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                    if (days >= 1) {
                        setCountdown(`Before start ${days} day${days > 1 ? 's' : ''}`);
                    } else {
                        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                        setCountdown(`Before contest: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                    }
                } else {
                    if (updateContestState)
                        updateContestState(type, contest);
                    clearInterval(intervalId);
                }
            };
            updateCountdown();
            return () => clearInterval(intervalId);
        }
    }, []);

    useEffect(() => {
        if (type == "ongoing") {
            const intervalId = setInterval(updateCountdown, 1000);
            function updateCountdown() {
                const currentTime = new Date();
                const timeDifference = contestEndTime - currentTime;
                if (timeDifference > 0) {
                    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                    setCountdown(`Contest end: ${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
                } else {
                    if (updateContestState)
                        updateContestState(type, contest);
                    clearInterval(intervalId);
                }
            };
            updateCountdown();
            return () => clearInterval(intervalId);
        }
    }, []);
    const userId = useSelector(userIdSelector);

    return (
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
                {
                    type == "ended" ?
                        <Link sx={{ cursor: 'pointer' }} onClick={() => handleRankingClick(contest.id)}>
                            Final standings
                        </Link> : null
                }
                {
                    type == "upcoming" ? countdown : null
                }
                {
                    type == "ongoing" ? countdown : null
                }
            </TableCell>
            <TableCell>
                <span>{contest?.user_contests?.length}</span>
            </TableCell>
        </TableRow>
    )
}

const ContestList = ({ updateContestState, updateContestContestants, contests, type }) => {
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
                            <ContestRow
                                type={type}
                                contest={contest}
                                handleIdClick={handleIdClick}
                                handleRankingClick={handleRankingClick}
                                toggleRegister={toggleRegister}
                                updateContestState={updateContestState}
                            />
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

