import { Button, Input } from '@mui/material';
import { useCallback } from "react";
import styles from "./UpfileBtn.module.css";

const openFilePicker = () => {
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
};

const UpFileBtn = () => {

    const handleFileUpload = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
            };
            reader.readAsText(file);
        }
    }, []);

    return (
        <>
            <Input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileUpload} />
            <Button variant="contained" onClick={openFilePicker} className={styles.custom_btn}>Choose file</Button>
        </>
    )
}

module.exports = UpFileBtn;