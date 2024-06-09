import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { userIdSelector } from "@/redux/reducers/user.reducer";
import submitService from "@/services/submit.service";
import { useRouter } from "next/router";
import ContestLayout from "@/components/layout/ContestLayout";
import SubmissionList from "@/components/submit/SubmissionList";
const Submissions = () => {
    const router = useRouter();
    const { contestId } = router.query;
    const userId = useSelector(userIdSelector);
    const [submissions, setSubmissions] = useState(null);

    const fetchSubmissions = useCallback(async () => {
        try {
            const { submissions } = await submitService.getByUserAndContest(userId, contestId);
            setSubmissions(submissions);
        }
        catch (e) {
            console.log('ERROR', e);
        }

    }, [contestId, userId]);

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