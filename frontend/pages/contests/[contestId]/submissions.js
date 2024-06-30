import { useState, useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { userIdSelector } from "@/redux/reducers/user.reducer";
import submitService from "@/services/submit.service";
import { useRouter } from "next/router";
import ContestLayout from "@/components/layout/ContestLayout";
import SubmissionList from "@/components/submit/SubmissionList";
import Verdict from "@/constants/verdict";
import sseClient from "@/utils/sseClient";
import { authorizeUser } from "@/utils/auth";

const Submissions = () => {
    const router = useRouter();
    const { contestId } = router.query;
    const userId = useSelector(userIdSelector);
    const [submissions, setSubmissions] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const hasFetched = useRef(false);
    const eventSourceRef = useRef(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            const { submissions, totalPages } = await submitService.getByUserAndContest(userId, contestId, 1);
            const unfulfilledSubmissions = submissions.filter((submission) => submission.verdict == Verdict.TT);
            if (unfulfilledSubmissions?.length) {
                eventSourceRef.current = sseClient(unfulfilledSubmissions, submissions, setSubmissions);
            }
            setSubmissions(submissions);
            setTotalPages(totalPages);
        }
        catch (e) {
            console.log('ERROR', e);
        }

    }, [contestId, userId]);

    const handlePageChange = async (event, value) => {
        setSubmissions([]);
        setPage(value);
        try {
            const { submissions, totalPages } = await submitService.getByUserAndContest(userId, contestId, value);
            setSubmissions(submissions);
            setTotalPages(totalPages);
        } catch (e) {
            console.log("ERROR", e);
        }
    };

    useEffect(() => {
        if (userId && contestId && !hasFetched.current) {
            fetchSubmissions();
            hasFetched.current = true;
        }
    }, [userId, contestId]);

    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                console.log('SSE CONNECTION CLOSED!');
            }
        };
    }, []);

    return (
        <ContestLayout>
            <SubmissionList
                data={submissions}
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </ContestLayout>
    );

}

export default Submissions;

export const getServerSideProps = authorizeUser;