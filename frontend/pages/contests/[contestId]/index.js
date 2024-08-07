import ContestLayout from "@/components/layout/ContestLayout";
import { useState, useRef, useCallback, useEffect } from "react";
import ContestProblems from "@/components/contest/ContestProblems";
import problemService from "@/services/problem.service";
import { useRouter } from "next/router";

export default function ContestItem() {
    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const hasFetched = useRef(false);
    const { contestId } = router.query;

    const fetchProblems = useCallback(async () => {
        try {
            const { problems } = await problemService.getProblemByContest(contestId);
            setProblems(problems);
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }, [contestId]);

    useEffect(() => {
        if (!hasFetched.current && contestId) {
            fetchProblems();
            hasFetched.current = true;
        }
    }, [contestId]);
    
    return (
        <ContestLayout>
            <ContestProblems problems={problems} />
        </ContestLayout>
    )
}