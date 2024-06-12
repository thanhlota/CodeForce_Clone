import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { userIdSelector } from "@/redux/reducers/user.reducer";
import submitService from "@/services/submit.service";
import { useRouter } from "next/router";
import ContestLayout from "@/components/layout/ContestLayout";
import SubmissionList from "@/components/submit/SubmissionList";
import Verdict from "@/constants/verdict";
import sseClient from "@/utils/sseClient";

const Submissions = () => {
    const router = useRouter();
    const { contestId } = router.query;
    const userId = useSelector(userIdSelector);
    const [submissions, setSubmissions] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            const { submissions } = await submitService.getByUserAndContest(userId, contestId);
            const unfulfilledSubmissions = submissions.find((submission) => submission.verdict == Verdict.TT);
            if (unfulfilledSubmissions?.length) {
                sseClient(unfulfilledSubmissions, updateSubmissions);
            }
            setSubmissions(submissions);
        }
        catch (e) {
            console.log('ERROR', e);
        }

    }, [contestId, userId]);

    const updateSubmissions = useCallback((submissionId, verdict) => {
        const updatedSubmissions = [...submissions];
        const submissionIndex = updatedSubmissions.findIndex(submission => submission.id == submissionId);
        if (submissionIndex !== -1) {
            updatedSubmissions[submissionIndex].verdict = verdict;
            setSubmissions(updatedSubmissions);
        }
    }, [submissions]);

    useEffect(() => {
        if (userId && contestId) {
            fetchSubmissions();
        }
    }, [userId, contestId]);

    return (
        <ContestLayout>
            <SubmissionList data={submissions} />
        </ContestLayout>
    );

}

module.exports = Submissions;