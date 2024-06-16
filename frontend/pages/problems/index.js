
import ProblemList from "@/components/problems/ProblemList";
import { useState, useEffect, useCallback, useRef } from "react";
import problemService from "@/services/problem.service";
export default function Problems() {
    const hasFetched = useRef(false);
    const [problems, setProblems] = useState([]);

    const fetchProblemsData = useCallback(async () => {
        try {
            const { problems } = await problemService.getProblems();
            problems.forEach((item) => {
                let merge_categories = item.categories.map((category) => category.type);
                merge_categories = merge_categories.join(", ");
                item.categories = merge_categories;
                item.limit = item.time_limit / 1000 + " s, " + item.memory_limit + " MB";
            });
            setProblems(problems);
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchProblemsData();
            hasFetched.current = true;
        }
    }, []);

    return (
        <>
            <div style={{ margin: '16px 48px' }}>
                <ProblemList data={problems} />
            </div>
        </>
    );
}