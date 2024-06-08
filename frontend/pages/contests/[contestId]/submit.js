import CodeEditor from "@/components/submit/CodeEditor";
import styles from "@/styles/submit.module.css";
import { useState, useCallback, useEffect } from "react";
import contestService from "@/services/contest.service";
import { useRouter } from "next/router";
import languages from "@/constants/languages";
import ContestLayout from "@/components/layout/ContestLayout";
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const ProblemDropdown = ({ problems, selectedProblem, onProblemSelect }) => {
    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                <InputLabel id="problem-select-label">Choose Problem</InputLabel>
                <Select
                    labelId="problem-select-label"
                    value={selectedProblem}
                    onChange={onProblemSelect}
                    label="Choose Problem"
                >
                    <MenuItem value="">
                        <em>Choose Problem</em>
                    </MenuItem>
                    {problems.map((problem, index) => (
                        <MenuItem key={index} value={problem.id}>
                            {problem.title}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

const LanguageDropdown = ({ languages, selectedLanguage, onLanguageSelect }) => {
    return (
        <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
            <InputLabel id="Language-select-label">Choose Language</InputLabel>
            <Select
                labelId="Language-select-label"
                value={selectedLanguage}
                onChange={onLanguageSelect}
                label="Choose Language"
            >
                <MenuItem value="">
                    <em>Choose Language</em>
                </MenuItem>
                {languages.map((language, index) => (
                    <MenuItem key={index} value={language}>
                        {language}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

const SubmitPage = () => {
    const router = useRouter();
    const { contestId } = router.query;

    const [source, setSource] = useState("");

    const [contest, setContest] = useState({
        name: "",
        problems: [],
    });

    const [selectedProblem, setSelectedProblem] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [timeLimit, setTimeLimit] = useState("");
    const [memoryLimit, setMemoryLimit] = useState("");

    const handleProblemSelect = (event) => {
        setSelectedProblem(event.target.value);
        const index = contest.problems.findIndex(problem => problem.id === event.target.value);
        if (index !== -1) {
            setMemoryLimit(contest.problems[index].memory_limit);
            setTimeLimit(contest.problems[index].time_limit / 1000);
        } else {
            setMemoryLimit(null);
            setTimeLimit(null);
        }
    };

    const handleLanguageSelect = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const fetchContest = useCallback(async () => {
        try {
            const { contest } = await contestService.getContestById(contestId);
            setContest({
                name: contest.name,
                problems: contest.problems
            })
        }
        catch (e) {
            console.log("ERROR", e);
        }
    }, [contestId]);

    useEffect(() => {
        if (contestId) {
            fetchContest();
        }
    }, [contestId]);

    return (
        <ContestLayout>
            {contest.name &&
                <div className={styles.page_container}>
                    <div className={styles.header}>
                        <div style={{
                            margin: "0 auto",
                            padding: "1.5em 0 0.5em 0",
                            fontSize: "1.25em"
                        }}>Submit Solution</div>
                        <div className={styles.contest_name}>{contest.name}</div>
                    </div>
                    <div className={styles.content}>
                        <table className={styles.table_form}>
                            <tr>
                                <td className={styles.field_name}>Problem:</td>
                                <td>
                                    <ProblemDropdown
                                        problems={contest.problems}
                                        selectedProblem={selectedProblem}
                                        onProblemSelect={handleProblemSelect}
                                        setTimeLimit={setTimeLimit}
                                        setMemoryLimit={setMemoryLimit}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    {timeLimit && memoryLimit && <div className={styles.limit}>
                                        <span>standard input/output</span>
                                        <span>{`${timeLimit} s, ${memoryLimit} MB`}</span>
                                    </div>
                                    }

                                </td>
                            </tr>
                            <tr>
                                <td className={styles.field_name}>Language:</td>
                                <td>
                                    <LanguageDropdown
                                        languages={languages}
                                        selectedLanguage={selectedLanguage}
                                        onLanguageSelect={handleLanguageSelect}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.field_name}>Source code:</td>
                                <td>
                                    <CodeEditor language={selectedLanguage} />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles.field_name}>Or choose file:</td>
                                <td>

                                </td>
                            </tr>
                            <tr>
                                <td className={styles.field_name}></td>
                                <td>

                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            }
        </ContestLayout>

    )
};

export default SubmitPage;