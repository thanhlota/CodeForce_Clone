import Grid from '@mui/material/Grid';
import styles from "./TestTable.module.css";
import { useState, useCallback } from "react";
import { Snackbar, Alert } from '@mui/material';

const TestTable = ({ input, output }) => {
    const [open, setOpen] = useState(false);

    const handleInputCopy = useCallback(async () => {
        await navigator.clipboard.writeText(input);
        setOpen(true);
    }, []);

    const handleOutputCopy = useCallback(async () => {
        await navigator.clipboard.writeText(output);
        setOpen(true);
    }, []);

    const handleClose = useCallback((event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }, []);

    return (
        <>
            <Grid container spacing={2} sx={{ paddingTop: 2, paddingLeft: 3 }}>
                <Grid item xs={6} className={styles.custom_grid}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            Input
                            <div className={styles.cpy_btn} onClick={handleInputCopy}>Copy</div>
                        </div>
                        <div className={styles.detail}>
                            {input}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={6} className={styles.custom_grid}>
                    <div className={styles.container}>
                        <div className={styles.title}>
                            output
                            <div className={styles.cpy_btn} onClick={handleOutputCopy}>Copy</div>
                        </div>
                        <div className={styles.detail}>
                            {output}
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Text copied to clipboard!
                </Alert>
            </Snackbar>
        </>
    );
}

export default TestTable;