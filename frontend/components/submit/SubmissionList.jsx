import { useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import styles from './SubmissionList.module.css';
import formatDate from '@/utils/formatDate';
import { useRouter } from 'next/router';

const SubmissionList = ({ data }) => {
    const router = useRouter();
    const { contestId } = router.query;

    const handleProblemClick = useCallback((problemId) => {
        if (contestId) {
            router.push(`/contests/${contestId}/problem/${problemId}`);
        }
    }, [contestId]);

    return (
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
                    {data && data.length && data.map((submission) => {
                        const { formattedDate, utc } = formatDate(submission.createdAt);
                        return (
                            <TableRow key={submission.id} className={styles.row}>
                                <TableCell className={styles.center}>
                                    <span className={styles.link}>
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
                                <TableCell className={styles.center}>{submission.verdict}</TableCell>
                                <TableCell className={styles.center} >
                                    <span className={styles.link} onClick={() => handleProblemClick(submission.problem_id)}>
                                        #{submission.problem_id}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default SubmissionList;