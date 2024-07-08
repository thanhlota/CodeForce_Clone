import styles from "./ContestMenu.module.css"
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GradeIcon from '@mui/icons-material/Grade';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { userIdSelector } from "@/redux/reducers/user.reducer";
import { Snackbar, Alert } from '@mui/material';
import { useState } from "react";

const ContestMenu = () => {
    const router = useRouter();
    const { contestId } = router.query;
    const userId = useSelector(userIdSelector);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const goToMySubmissions = () => {
        if (contestId && userId) {
            router.push(`/contests/${contestId}/submissions`);
        }
        else {
            setShowSnackbar(true);
        }
    }

    const goToMySubmit = () => {
        if (contestId && userId) {
            router.push(`/contests/${contestId}/submit`);
        }
        else {
            setShowSnackbar(true);
        }
    }

    const goToProblems = () => {
        router.push(`/contests/${contestId}`);
    }

    const goToRankings = () => {
        router.push(`/contests/${contestId}/rankings`);
    }

    return (
        <>
            <div className={styles.menu_container}>
                <div className={styles.menu_item} onClick={goToProblems}>
                    <span><QuizIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                    <span>Problems</span>
                </div>
                <div className={styles.menu_item} onClick={goToMySubmit}>
                    <span><CodeIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                    <span>Submit</span>
                </div>
                <div className={styles.menu_item} onClick={goToMySubmissions} >
                    <span><FormatListBulletedIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                    <span>My Submissions</span>
                </div>
                <div className={styles.menu_item} onClick={goToRankings}>
                    <span><GradeIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                    <span>Rankings</span>
                </div>
            </div>
            <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)} className={styles.snackbarContainer}>
                <Alert severity="error" onClose={() => setShowSnackbar(false)}>
                    You need to login to access this feature.
                </Alert>
            </Snackbar>
        </>
    );
}
export default ContestMenu;