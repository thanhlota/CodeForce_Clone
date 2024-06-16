import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useRef } from "react";
import problemService from "@/services/problem.service";
import styles from "@/styles/problem.module.css";
import TestTable from "@/components/problems/TestTable";
import ContestLayout from "@/components/layout/ContestLayout";
import { updateUserInfo } from "@/utils/auth";

const ProblemItem = () => {
    const router = useRouter();
    const hasFetched = useRef(false);
    const { problemId } = router.query;
    const [problemInfo, setProblemInfo] = useState({
        title: "",
        time_limit: "",
        memory_limit: "",
        description: "",
        guide_output: "",
        guide_input: "",
        sample_testcases: [],
    });

    const fetchProblem = useCallback(async () => {

        try {
            const { problem } = await problemService.getProblemById(problemId);
            setProblemInfo({
                title: problem.title,
                time_limit: problem.time_limit / 1000,
                memory_limit: problem.memory_limit,
                description: problem.description,
                guide_input: problem.guide_input,
                guide_output: problem.guide_output,
                sample_testcases: problem.testcases
            })
        }
        catch (e) {
            console.log('ERROR', e);
        }
    }, [problemId]);

    useEffect(() => {
        if (problemId && !hasFetched.current) {
            fetchProblem();
            hasFetched.current = true;
        }
    }, [problemId]);

    return (
        <ContestLayout>
            {problemInfo?.title && (
                <div className={styles.problem_container}>
                    <div className={styles.problem_header}>
                        <div className={styles.problem_title}>{problemInfo.title}</div>
                        <div className={styles.time_limit}>
                            <span style={{ marginRight: "0.5em" }}>
                                time limit per test:
                            </span>
                            <span>
                                {problemInfo.time_limit} second
                            </span>
                        </div>
                        <div className={styles.memory_limit}>
                            <span style={{ marginRight: "0.5em" }}>
                                memory limit per test:
                            </span>
                            <span>
                                {problemInfo.memory_limit} MB
                            </span>
                        </div>
                    </div>
                    <div className={styles.problem_description}>
                        <div className={styles.problem_title}>Problem Description</div>
                        <div className={styles.content}>{problemInfo.description}</div>
                    </div>
                    <div className={styles.guide_input}>
                        <div className={styles.problem_title}>Input</div>
                        <div className={styles.content}>{problemInfo.guide_input}</div>
                    </div>
                    <div className={styles.guide_output}>
                        <div className={styles.problem_title}>Output</div>
                        <div className={styles.content}>{problemInfo.guide_output}</div>
                    </div>
                    <div className={styles.sample_tests}>
                        <div className={styles.problem_title}>Example</div>
                        <div>
                            {
                                problemInfo.sample_testcases.map((tc, index) => {
                                    return (
                                        <>
                                            <div className={styles.tc_title}>{`Test case ${index + 1}`}</div>
                                            <TestTable input={tc.input} output={tc.expected_output} />
                                        </>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            )}
        </ContestLayout>
    )
}
export default ProblemItem;

export const getServerSideProps = updateUserInfo;
