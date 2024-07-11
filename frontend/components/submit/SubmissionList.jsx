import { useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination,
    RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import styles from './SubmissionList.module.css';
import formatDate from '@/utils/formatDate';
import { useRouter } from 'next/router';
import verdict from "@/constants/verdict";
import submitService from '@/services/submit.service';
import TestModal from '@/components/submit/TestModal';
import Point from "@/enum/Point";

const SubmissionList = ({ seeUser, data, page, totalPages, handlePageChange }) => {
    const router = useRouter();
    const { contestId } = router.query;
    const [open, setOpen] = useState(false);
    const [srcCode, setSrcCode] = useState(null);
    const [results, setResults] = useState(null);
    const [language, setLanguage] = useState(null);

    const [sortOption, setSortOption] = useState('submissionTime');

    const sortedData = data ? [...data].sort((a, b) => {
        if (sortOption === 'submissionTime') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortOption === 'executionTime') {
            return a.time - b.time;
        } else if (sortOption === 'memoryUsage') {
            return a.memory - b.memory;
        }
        return 0;
    }) : [];


    const handleProblemClick = useCallback((problemId) => {
        if (contestId) {
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
                            {
                                seeUser ? <TableCell className={styles.header}>Who</TableCell> : null
                            }
                            <TableCell className={styles.header}>When</TableCell>
                            <TableCell className={styles.header}>Language</TableCell>
                            <TableCell className={styles.header}>Verdict</TableCell>
                            <TableCell className={styles.header}>Problem</TableCell>
                            <TableCell className={styles.header}>Time</TableCell>
                            <TableCell className={styles.header}>Memory</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(data && data.length) ? sortedData.map((submission) => {
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
                                    {
                                        seeUser ?
                                            <TableCell className={styles.center}>
                                                <span>
                                                    {submission.user_name}
                                                </span>
                                            </TableCell> : null
                                    }
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
                                    <TableCell className={styles.center} >
                                        <span>
                                            {submission.time == Point.MAX_TIME_LIMIT ? null : submission.time + " ms"}
                                        </span>
                                    </TableCell>
                                    <TableCell className={styles.center} >
                                        <span>
                                            {submission.memory == Point.MAX_MEMORY_LIMIT ? null : submission.memory + " KB"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )
                        }) :
                            <TableRow>
                                <TableCell colSpan={seeUser ? 8 : 7} className={styles.center}>
                                    No data available
                                </TableCell>
                            </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.controls}>
                {
                    totalPages ?
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            className={styles.pagination}
                        /> : null
                }
                <RadioGroup
                    row
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className={styles.radioGroup}
                >
                    <FormControlLabel value="submissionTime" control={<Radio />} label="Submission Time" />
                    <FormControlLabel value="executionTime" control={<Radio />} label="Execution Time" />
                    <FormControlLabel value="memoryUsage" control={<Radio />} label="Memory Usage" />
                </RadioGroup>
            </div>
            <TestModal srcCode={srcCode} results={results} language={language} open={open} handleClose={handleClose} />
        </>
    );
};

export default SubmissionList;