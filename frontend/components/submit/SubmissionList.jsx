import { useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination
} from '@mui/material';
import styles from './SubmissionList.module.css';
import formatDate from '@/utils/formatDate';
import { useRouter } from 'next/router';
import verdict from "@/constants/verdict";
import submitService from '@/services/submit.service';
import TestModal from '@/components/submit/TestModal';

const SubmissionList = ({ data, page, totalPages, handlePageChange }) => {
    const router = useRouter();
    const { contestId } = router.query;
    const [open, setOpen] = useState(false);
    const [srcCode, setSrcCode] = useState(null);
    const [results, setResults] = useState(null);
    const [language, setLanguage] = useState(null);

    const handleProblemClick = useCallback((problemId) => {
        if (contestId) {s
            router.push(`/contests/${contestId}/problem/${problemId}`);
        }
    }, [contestId]);

    const handleSubmissionClick = useCallback(async (submissionId) => {
        try {
            if (submissionId) {
                const { submission } = await submitService.getById(submissionId);
                if (submission?.code) {
                    setSrcCode(submission.code);
                }
                if (submission?.language) {
                    setLanguage(submission.language);
                }
                if (submission?.results) {
                    setResults(submission.results);
                }
                setOpen(true);
            }
        }
        catch (e) {
            console.log("ERROR", e);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.header}>Submission</TableCell>
                            <TableCell className={styles.header}>When</TableCell>
                            <TableCell className={styles.header}>Language</TableCell>
                            <TableCell className={styles.header}>Verdict</TableCell>
                            <TableCell className={styles.header}>Problem</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(data && data.length) ? data.map((submission) => {
                            const { formattedDate, utc } = formatDate(submission.createdAt);
                            let verdictClass = "";
                            if (submission.verdict === verdict.TT) {
                                verdictClass = styles.testing;
                            }
                            else if (submission.verdict === verdict.AC) {
                                verdictClass = styles.accept;
                            }
                            else {
                                verdictClass = styles.error;
                            }
                            return (
                                <TableRow key={submission.id} className={styles.row}>
                                    <TableCell className={styles.center}>
                                        <span className={styles.link} onClick={() => handleSubmissionClick(submission.id)}>
                                            #{submission.id}
                                        </span>
                                    </TableCell>
                                    <TableCell className={styles.center}>
                                        <div className={styles.dateTime}>
                                            {formattedDate}
                                            <span className={styles.utc}>{utc}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className={styles.center}>{submission.language}</TableCell>
                                    <TableCell className={styles.center}>
                                        <span className={verdictClass}>
                                            {submission.verdict}
                                        </span>
                                    </TableCell>
                                    <TableCell className={styles.center} >
                                        <span className={styles.link} onClick={() => handleProblemClick(submission.problem_id)}>
                                            #{submission.problem_id}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {
                totalPages ?
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        className={styles.pagination}
                    /> : null
            }
            <TestModal srcCode={srcCode} results={results} language={language} open={open} handleClose={handleClose} />
        </>
    );
};

export default SubmissionList;