import React from 'react';
import styles from "./AppHeader.module.css";
import appIcon from "@/public/favicon.ico"
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QuizIcon from '@mui/icons-material/Quiz';
import { useRouter } from "next/router";
import { Typography, Avatar } from '@mui/material';
import { useState, useCallback } from 'react';
import LoginModal from './LoginModal';
import { useSelector } from 'react-redux';
import {  userNameSelector } from '@/redux/reducers/user.reducer';
import { deepOrange } from '@mui/material/colors';

export default function Header() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const username = useSelector(userNameSelector);

    const toggleOpen = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, [])

    return (
        <div className={styles.header}>
            <div className={styles.left_navigation}>
                <div>
                    <img src={appIcon.src} alt="Logo" style={{ height: '60px', marginLeft: '16px' }} />
                </div>
                <span className={styles.app_title}>
                    <Typography className={styles.app_name}>
                        HustCode Contest
                    </Typography>
                </span>
                <div className={styles.navigation_item} onClick={() => router.push("/")}>
                    <span className={styles.custom_icon}><HomeIcon fontSize="10px" /></span>
                    <span>Home</span>
                </div>
                <div className={styles.navigation_item}>
                    <span className={styles.custom_icon} ><EmojiEventsIcon fontSize="10px" /></span>
                    <span>Contests</span>
                </div>
                <div className={styles.navigation_item} onClick={() => router.push("/problems")}>
                    <span className={styles.custom_icon}><QuizIcon fontSize="10px" /></span>
                    <span>Problems</span>
                </div>
            </div>
            <div className={styles.right_navigation}>
                {
                    username ?
                        <Avatar sx={{ bgcolor: deepOrange[500] }} className={styles.avatar}>{username[0]}</Avatar>
                        :
                        <div className={styles.login_btn} onClick={toggleOpen}>
                            Login
                        </div>
                }

            </div>
            <LoginModal open={open} handleClose={toggleOpen} />
        </div >
    );
}