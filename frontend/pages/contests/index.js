import { updateUserInfo } from "@/utils/auth";
import { useState, useEffect, useCallback, useRef } from "react";
import contestService from "@/services/contest.service";
import ContestList from "@/components/contest/ContestList";
import { formatContest2 } from "@/utils/formatContest";
import { Container, Typography, Box } from '@mui/material';

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

    const updateContestContestants = (contestId, contestants) => {
        const updatedUpcomingContests = contests.upcomingContests.map(contest => {
            if (contest.id === contestId) {
                return {
                    ...contest,
                    user_contests: contestants
                };
            }
            return contest;
        });
        const updatedContests = { ...contests, upcomingContests: updatedUpcomingContests }
        setContests(updatedContests);
    }

    const updateContestState = (type, contest) => {
        if (type == "upcoming") {
            const updatedUpcoming = contests.upcomingContests.filter(item => item.id != contest.id);
            const updatedOngoing = [...contests.ongoingContests, contest];
            const updatedContests = { ...contests, upcomingContests: updatedUpcoming, ongoingContests: updatedOngoing };
            setContests(updatedContests);
        }
        else if (type == "ongoing") {
            const updatedOngoing = contests.ongoingContests.filter(item => item.id != contest.id);
            const updatedEnd = [contest, ...contests.endedContests];
            const updatedContests = { ...contests, ongoingContests: updatedOngoing, endedContests: updatedEnd };
            setContests(updatedContests);
        }
    }

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
                        <ContestList updateContestState={updateContestState} contests={contests.ongoingContests} type="ongoing" />
                    </div>
                ) : null}
            </Box>
            <Box sx={{ mb: 4 }}>
                {(contests?.upcomingContests && contests.upcomingContests.length) ? (
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Upcoming Contests
                        </Typography>
                        <ContestList updateContestState={updateContestState} updateContestContestants={updateContestContestants} contests={contests.upcomingContests} type="upcoming" />
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