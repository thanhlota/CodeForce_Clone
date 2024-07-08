import { updateUserInfo } from "@/utils/auth";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect, useRef } from "react";
import ContestLayout from "@/components/layout/ContestLayout";
import Verdict from "@/constants/verdict";
import SubmissionList from "@/components/submit/SubmissionList";
import submitService from "@/services/submit.service";

const problemPage = () => {
    const router = useRouter();
    const { pid } = router.query;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [submissions, setSubmissions] = useState(null);

    const hasFetched = useRef(false);

    const fetchSubmissions = useCallback(async () => {
        try {
            const { submissions, totalPages } = await submitService.getByProblem(pid, 1);
            setSubmissions(submissions);
            setTotalPages(totalPages);
        }
        catch (e) {
            console.log('ERROR', e);
        }

    }, [pid]);

    const handlePageChange = async (event, value) => {
        setSubmissions([]);
        setPage(value);
        try {
            const { submissions, totalPages } = await submitService.getByProblem(pid, value);
            setSubmissions(submissions);
            setTotalPages(totalPages);
        } catch (e) {
            console.log("ERROR", e);
        }
    };

    useEffect(() => {
        if (pid && !hasFetched.current) {
            fetchSubmissions();
            hasFetched.current = true;
        }
    }, [pid]);
    return (
        <ContestLayout>
            <SubmissionList
                data={submissions}
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </ContestLayout>
    )
}

export default problemPage;

export const getServerSideProps = updateUserInfo;
