import React, { useCallback, useState } from 'react';
import { Modal, Box, Button, TextField, Typography, Snackbar, CircularProgress, Alert, Link } from '@mui/material';
import styles from './LoginModal.module.css';
import Verify from '@/utils/verify';
import UserService from '@/services/user.service';

const RegisterModal = ({ registerOpen, toggleRegister, toggleOpen }) => {
    const [email, setEmail] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [registerMessage, setRegisterMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('');
    const handleLoginClick = () => {
        toggleRegister();
        toggleOpen();
    }

    const fetchRegister = useCallback(async (info) => {
        try {
            setLoading(true);
            await UserService.register(info);
            setRegisterMessage("User registered successfully!");
            setSnackbarSeverity('success');
            toggleRegister();
        } catch (e) {
            setSnackbarSeverity('error');
            setRegisterMessage("An error occurred. Please try again.");
        } finally {
            setSnackbarOpen(true);
            setLoading(false);
        }
    }, []);

    const handleSubmit = useCallback(async (event) => {
        event.preventDefault();
        const newErrors = {};
        if (!username) {
            newErrors.username = 'Username is required';
        }
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

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
        }

        if (password && confirmPassword && password !== confirmPassword) {
            newErrors.confirmPassword = 'Password and confirm password dont match';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            await fetchRegister({ username, email, password, confirmPassword });
        }
    }, [username, confirmPassword, username, email, password, fetchRegister]);

    const handleSnackbarClose = useCallback(() => {
        setSnackbarOpen(false);
    }, []);

    const handleUsernameChange = useCallback((e) => {
        setUserName(e.target.value);
        if (errors.username) {
            setErrors((prevErrors) => ({ ...prevErrors, username: '' }));
        }
    }, [errors.username]);

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

    const handleConfirmPasswordChange = useCallback((e) => {
        setConfirmPassword(e.target.value);
        if (errors.confirmPassword) {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: '' }));
        }
    }, [errors.password]);

    return (
        <>
            <Modal
                open={registerOpen}
                onClose={toggleRegister}
                aria-labelledby="modal-register-title"
                aria-describedby="modal-register-description"
            >
                <Box className={styles.modal_box}>
                    <form onSubmit={handleSubmit}>
                        <Typography id="modal-register-title" variant="h6" component="h2" className={styles.modal_title}>
                            HustCode Contest
                        </Typography>
                        <TextField
                            className={styles.text_field}
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            autoFocus
                            value={username}
                            onChange={handleUsernameChange}
                            error={!!errors.username}
                            helperText={errors.username}
                        />
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
                        <TextField
                            className={styles.text_field}
                            label="Confirm Password"
                            value={confirmPassword}
                            type="password"
                            onChange={handleConfirmPasswordChange}
                            fullWidth
                            margin="normal"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={styles.submit_button}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Register"}
                        </Button>
                        <Typography variant="body2" align="center" className={styles.register_link}>
                            Already have an account? <Link sx={{ cursor: 'pointer' }} onClick={handleLoginClick}>Login here</Link>
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
                    {registerMessage}
                </Alert>
            </Snackbar>
        </>

    );
};

export default RegisterModal;
