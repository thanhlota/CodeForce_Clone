import styles from "./ContestMenu.module.css"
import QuizIcon from '@mui/icons-material/Quiz';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GradeIcon from '@mui/icons-material/Grade';
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { userIdSelector } from "@/redux/reducers/user.reducer";

const ContestMenu = () => {
    const router = useRouter();
    const { contestId } = router.query;
    const userId = useSelector(userIdSelector);

    const goToMySubmissions = () => {
        if (contestId && userId) {
            router.push(`/contests/${contestId}/submissions`);
        }
    }

    return (
        <div className={styles.menu_container}>
            <div className={styles.menu_item}>
                <span><QuizIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                <span>Problems</span>
            </div>
            <div className={styles.menu_item} onClick={() => router.push(`/contests/${contestId}/submit`)}>
                <span><CodeIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                <span>Submit</span>
            </div>
            <div className={styles.menu_item} onClick={goToMySubmissions} >
                <span><FormatListBulletedIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                <span>My Submissions</span>
            </div>
            <div className={styles.menu_item}>
                <span><GradeIcon fontSize="10px" sx={{ marginRight: 1, marginTop: '2px' }} /></span>
                <span>Rankings</span>
            </div>
        </div>
    );
}
export default ContestMenu;