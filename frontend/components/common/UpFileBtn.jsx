import { Button, Input, Snackbar, Alert } from '@mui/material';
import { useState, useCallback } from "react";
import styles from "./UpfileBtn.module.css";

const UpFileBtn = ({ canUploadFile, setFileContent }) => {
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const openFilePicker = () => {
        const error = canUploadFile();
        if (error) {
            setError(error);
            setOpenSnackbar(true);
            return;
        }
        const fileInput = document.getElementById('fileInput');
        fileInput.click();
    };

    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target.result;
                try {
                    setFileContent(content);
                }
                catch (error) {
                    console.log("ERROR:", error);
                }
            };
            reader.readAsText(file);
        }
    }, []);

    return (
        <>
            <Input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileUpload} />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert severity="error" onClose={handleCloseSnackbar}>
                    {error}
                </Alert>
            </Snackbar>
            <Button variant="contained" onClick={openFilePicker} className={styles.custom_btn}>Choose file</Button>
        </>
    )
}

module.exports = UpFileBtn;