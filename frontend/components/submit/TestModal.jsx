import styles from './SubmissionList.module.css';
import formatVerdict from '@/utils/formatVerdict';
import {
    Modal
} from '@mui/material';
import CodeEditor from "@/components/submit/CodeEditor";
import CloseIcon from '@mui/icons-material/Close';

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

const TestModal = ({ srcCode, results, language, open, handleClose }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <div className={styles.modal_content}>
                <div className={styles.close_button} onClick={handleClose}><CloseIcon /></div>
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
    )

}
export default TestModal;