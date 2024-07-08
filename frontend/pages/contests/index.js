import { updateUserInfo } from "@/utils/auth";
import { useState, useEffect, useCallback, useRef } from "react";
import contestService from "@/services/contest.service";
import ContestList from "@/components/contest/ContestList";
import { formatContest2 } from "@/utils/formatContest";
import { Container, Typography, Box, Paper } from '@mui/material';

export default function ContestPage() {
    const [contests, setContests] = useState(null);
    const hasFetched = useRef(false);
    const fetchContests = useCallback(async () => {
        try {
            const res = await contestService.getContests();
            if (res.contests) {
                const contests = formatContest2(res.contests);
                setContests(contests);
            }
        }
        catch (e) {
            console.log("ERROR", e);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchContests();
            hasFetched.current = true;
        }
    }, []);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                {(contests?.ongoingContests && contests.ongoingContests.length) ? (
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Ongoing Contests
                        </Typography>
                        <ContestList contests={contests.ongoingContests} type="ongoing" />
                    </div>
                ) : null}
            </Box>
            <Box sx={{ mb: 4 }}>
                {(contests?.upcomingContests && contests.upcomingContests.length) ? (
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Upcoming Contests
                        </Typography>
                        <ContestList contests={contests.upcomingContests} type="upcoming" />
                    </div>
                ) : null}
            </Box>
            <Box sx={{ mb: 4 }}>
                {(contests?.endedContests && contests.endedContests.length) ? (
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Ended Contests
                        </Typography>
                        <ContestList contests={contests.endedContests} type="ended" />
                    </div>
                ) : null}
            </Box>
        </Container>
    )
}

export const getServerSideProps = updateUserInfo;