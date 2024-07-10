import React, { useCallback, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Snackbar, CircularProgress, Alert, Link } from '@mui/material';
import styles from './LoginModal.module.css';
import Verify from '@/utils/verify';
import UserService from '@/services/user.service';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/reducers/user.reducer';
import { useRouter } from 'next/router';

const LoginModal = ({ open, handleClose, toggleRegister }) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const dispatch = useDispatch();

    const handleRegisterClick = () => {
        handleClose();
        toggleRegister();
    }

    const fetchLogin = useCallback(async (info) => {
        try {
            setLoading(true);
            const data = await UserService.login(info);
            if (data.message) {
                setErrors({ email: true, password: "Incorrect email or password" });
            } else {
                dispatch(loginSuccess(data));
                setLoginMessage("User logged in successfully!");
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                handleClose();
                if (data.role == "admin") {
                    router.push("/admin");
                }
            }
        } catch (e) {
            setSnackbarSeverity('error');
            setLoginMessage("An error occurred. Please try again.");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!Verify.email(email)) {
            newErrors.email = 'Email is not valid';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (!Verify.password(password)) {
            newErrors.password = 'Password is not valid';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            await fetchLogin({ email, password });
        }
    }, [email, password, fetchLogin]);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
        }
    }, [errors.email]);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        if (errors.password) {
            setErrors((prevErrors) => ({ ...prevErrors, password: '' }));
        }
    }, [errors.password]);

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-login-title"
                aria-describedby="modal-login-description"
            >
                <Box className={styles.modal_box}>
                    <form onSubmit={handleSubmit}>
                        <Typography id="modal-login-title" variant="h6" component="h2" className={styles.modal_title}>
                            HustCode Contest
                        </Typography>
                        <TextField
                            className={styles.text_field}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={handleEmailChange}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            className={styles.text_field}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                            error={!!errors.password}
                            helperText={errors.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={styles.submit_button}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Sign In"}
                        </Button>
                        <Typography variant="body2" align="center" className={styles.register_link}>
                            Don't have an account? <Link sx={{ cursor: 'pointer' }} onClick={handleRegisterClick}>Register here</Link>
                        </Typography>
                    </form>
                </Box>
            </Modal>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {loginMessage}
                </Alert>
            </Snackbar>
        </>

    );
};

export default LoginModal;
