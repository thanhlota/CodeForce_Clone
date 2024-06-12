import { useState, useCallback } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Modal
} from '@mui/material';
import styles from './SubmissionList.module.css';
import formatDate from '@/utils/formatDate';
import { useRouter } from 'next/router';
import verdict from "@/constants/verdict";
import CodeEditor from "@/components/submit/CodeEditor";
import submitService from '@/services/submit.service';
import formatVerdict from '@/utils/formatVerdict';

const TestItem = ({ index, time, memory, verdict, input, output, expected_output }) => {
    let title = `Test: #${index + 1}`;
    if (time) title += `, time: ${Math.floor(time / 1000000)} ms`;
    if (memory) title += `, memory: ${Math.floor(memory / 1024)} KB`;
    if (verdict) title += `, verdict:  ${formatVerdict(verdict)}`;
    return (
        <div className={styles.test_item}>
            <div className={styles.test_item_header}>
                {title}
            </div>
            <div className={styles.test_content}>
                <div>Input</div>
                <div className={styles.code_display}>{input}</div>
            </div>
            <div className={styles.test_content}>
                <div>Output</div>
                <div className={styles.code_display}>{output}</div>
            </div>
            <div className={styles.test_content}>
                <div>Expected Output</div>
                <div className={styles.code_display}>{expected_output}</div>
            </div>
        </div>
    )
}
const SubmissionList = ({ data }) => {
    const router = useRouter();
    const { contestId } = router.query;
    const [open, setOpen] = useState(false);
    const [srcCode, setSrcCode] = useState(null);
    const [results, setResults] = useState(null);
    const [language, setLanguage] = useState(null);

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
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className={styles.modal_content}>
                    <CodeEditor srcCode={srcCode} editable={false} language={language} fullWidth={true} customBackground={"#f0f0f0"} />
                    <hr />
                    <div className={styles.test_container}>
                        <div className={styles.header}>
                            <h4>Judgement Protocol</h4>
                        </div>
                        {
                            results && results.length && results.map((item, index) => {
                                const { time, memory, output, expected_output, input, verdict } = item;
                                return (
                                    <TestItem
                                        index={index}
                                        time={time}
                                        memory={memory}
                                        input={input}
                                        output={output}
                                        expected_output={expected_output}
                                        verdict={verdict}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SubmissionList;