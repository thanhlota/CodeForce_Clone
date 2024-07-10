import React from 'react';
import styles from "./AppHeader.module.css";
import appIcon from "@/public/favicon.ico"
import HomeIcon from '@mui/icons-material/Home';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import QuizIcon from '@mui/icons-material/Quiz';
import { useRouter } from "next/router";
import { Typography, Avatar, Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import { useState, useCallback } from 'react';
import LoginModal from '@/components/user/LoginModal';
import RegisterModal from '@/components/user/RegisterModal';
import { useSelector, useDispatch } from 'react-redux';
import { userNameSelector, accessTokenSelector, logout } from '@/redux/reducers/user.reducer';
import { deepOrange } from '@mui/material/colors';
import UserService from '@/services/user.service';

export default function Header() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const username = useSelector(userNameSelector);
    const isAdminRoute = router.pathname.includes("/admin");
    const accessToken = useSelector(accessTokenSelector);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const toggleOpen = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, [])

    const toggleRegister = useCallback(() => {
        setRegisterOpen((preOpen) => !preOpen);
    }, []);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAvatarClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleLogout = async () => {
        try {
            const res = await UserService.logOut(accessToken);
            if (res.status == 200) {
                dispatch(logout());
                setSnackbarMessage('User logout successfully!');
                setSnackbarSeverity('success');
            }
            else {
                setSnackbarMessage('User logout failed!');
                setSnackbarSeverity('error');
            }
            setAnchorEl(null);
            setSnackbarOpen(true);
            router.push("/");
        }
        catch (e) {
            console.log("ERROR:", e);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };
    
    return (
        <div className={`${styles.header} ${isAdminRoute ? styles.custom_header : ''}`}>
            <div className={styles.left_navigation}>
                <div>
                    <img src={appIcon.src} alt="Logo" style={{ height: '60px', marginLeft: '16px' }} />
                </div>
                {
                    isAdminRoute ?
                        (
                            <>
                                <span className={styles.app_title}>
                                    <Typography className={styles.app_name}>
                                        HustCode Management
                                    </Typography>
                                </span>
                            </>
                        )
                        :
                        (
                            <>
                                <span className={styles.app_title}>
                                    <Typography className={styles.app_name}>
                                        HustCode Contest
                                    </Typography>
                                </span>
                                <div className={`${styles.navigation_item} ${router.pathname === "/" ? styles.active : ''}`}
                                    onClick={() => router.push("/")}>
                                    <span className={styles.custom_icon}><HomeIcon fontSize="10px" /></span>
                                    <span>Home</span>
                                </div>
                                <div className={`${styles.navigation_item} ${router.pathname === "/contests" ? styles.active : ''}`}
                                    onClick={() => router.push("/contests")}>
                                    <span className={styles.custom_icon} ><EmojiEventsIcon fontSize="10px" /></span>
                                    <span>Contests</span>
                                </div>
                                <div className={`${styles.navigation_item} ${router.pathname === "/problems" ? styles.active : ''}`}
                                    onClick={() => router.push("/problems")}>
                                    <span className={styles.custom_icon}><QuizIcon fontSize="10px" /></span>
                                    <span>Problems</span>
                                </div>
                            </>
                        )
                }
            </div>
            <div className={styles.right_navigation}>
                {
                    username ?
                        <>
                            <Avatar
                                sx={{ bgcolor: deepOrange[500], cursor: 'pointer' }}
                                className={styles.avatar}
                                onClick={handleAvatarClick}
                            >
                                {username[0]}
                            </Avatar>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                        :
                        <div className={styles.login_btn} onClick={toggleOpen}>
                            Login
                        </div>
                }

            </div>
            <LoginModal open={open} handleClose={toggleOpen} toggleRegister={toggleRegister} />
            <RegisterModal registerOpen={registerOpen} toggleRegister={toggleRegister} toggleOpen={toggleOpen} />
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div >
    );
}