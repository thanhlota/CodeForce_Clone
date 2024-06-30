import { updateUserInfo } from "@/utils/auth";
import { useState, useEffect, useCallback, useRef } from "react";
import contestService from "@/services/contest.service";
import ContestList from "@/components/contest/ContestList";
import { formatContest2 } from "@/utils/formatContest";

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
        <div style={{ margin: '16px 48px' }}>
            {
                (contests?.ongoingContests && contests.ongoingContests.length) ?
                    <>
                        <h1>Ongoing contest</h1>
                        <ContestList contests={contests.ongoingContests} type="ongoing" />
                    </> : null
            }
            {
                (contests?.upcomingContests && contests.upcomingContests.length) ?
                    <>
                        <h1>Upcoming contest</h1>
                        <ContestList contests={contests.upcomingContests} type="upcoming" />
                    </> : null
            }
            {
                (contests?.endedContests && contests.endedContests.length) ?
                    <>
                        <h1>Ended contest</h1>
                        <ContestList contests={contests.endedContests} type="ended" />
                    </> : null
            }
        </div>
    )
}

export const getServerSideProps = updateUserInfo;