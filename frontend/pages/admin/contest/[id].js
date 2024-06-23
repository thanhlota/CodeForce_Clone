import AdminLayout from "@/components/layout/AdminLayout"
import { authorizeAdmin } from "@/utils/auth";
import { useState, useCallback, useRef, useEffect } from "react";
import ProblemList from "@/components/problems/ProblemList";
import problemService from "@/services/problem.service";
import { useRouter } from "next/router";

export default function ContestPage() {
    const router = useRouter();
    const [problems, setProblems] = useState(null);
    const hasFetched = useRef(false);
    const { id: contestId } = router.query;
    const fetchProblems = useCallback(async () => {
        try {
            const { problems } = await problemService.getProblemByContest(contestId);
            problems.forEach((item) => {
                const merge_categories = item.categories.map((category) => category.type);
                const display_categories = merge_categories.join(", ");
                item.categories = merge_categories;
                item.display_categories = display_categories;
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
            fetchProblems();
            hasFetched.current = true;
        }
    }, [])

    return (
        <AdminLayout>
            <ProblemList data={problems} setData={setProblems} admin={true} />
        </AdminLayout>
    )
}

export const getServerSideProps = authorizeAdmin;