import ContestLayout from "@/components/layout/ContestLayout";
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import ContestRankings from "@/components/contest/ContestRankings";
import problemService from "@/services/problem.service";
import rankingService from "@/services/ranking.service";

export default function Rankings() {
    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const [scores, setScores] = useState([]);
    const [contestTime, setContestTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const hasFetched = useRef(false);

    const { contestId } = router.query;

    const fetchProblems = useCallback(async () => {
        try {
            const { problems } = await problemService.getProblemByContest(contestId);
            if (problems?.length) {
                setContestTime(problems[0].contest.start_time);
                setEndTime(problems[0].contest.end_time);
            }
            const newProblems = problems.map((item) => item.id);
            setProblems(newProblems);
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }, [contestId]);

    const fetchscores = useCallback(async () => {
        try {
            const { scores } = await rankingService.getRankings(contestId);
            setScores(scores);
        }
        catch (e) {
            console.log("ERROR", e);
        }
    }, [contestId]);

    useEffect(() => {
        if (!hasFetched.current && contestId) {
            fetchProblems();
            fetchscores();
            hasFetched.current = true;
        }
    }, [contestId]);

    return (
        <ContestLayout>
            <ContestRankings contestTime={contestTime} endTime={endTime} scores={scores} problems={problems} />
        </ContestLayout>
    )
}