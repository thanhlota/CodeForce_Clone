import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import styles from "./ProblemModal.module.css";
import Category from "./Category";

const TextEditor = dynamic(() => import('@/components/problems/TextEditor'), { ssr: false });

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
};

const MAX_TIME_LIMIT = 5000;
const MIN_TIME_LIMIT = 0;
const MAX_MEMORY_LIMIT = 500;
const MIN_MEMORY_LIMIT = 0;

const ProblemModal = ({
    isEditing,
    open,
    handleClose,
    problem,
    setProblem,
    selectedCategories,
    setSelectedCategories,
    handleSubmit
}) => {
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleAddCategory = (category) => {
        if (!selectedCategories.includes(category)) {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        setSelectedCategories(selectedCategories.filter((category) => category !== categoryToDelete));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProblem(prevProblem => ({
            ...prevProblem,
            [name]: value
        }));
    };


    const handleDescriptionChange = (value) => {
        setProblem(prevProblem => ({
            ...prevProblem,
            description: value
        }));
    };

    const handleGuideInputChange = (value) => {
        setProblem(prevProblem => ({
            ...prevProblem,
            guide_input: value
        }));
    };

    const handleGuideOutputChange = (value) => {
        setProblem(prevProblem => ({
            ...prevProblem,
            guide_output: value
        }));
    };


    const handleTimeChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (value > MAX_TIME_LIMIT) value = MAX_TIME_LIMIT;
        if (value < MIN_TIME_LIMIT) value = MIN_TIME_LIMIT;
        setProblem(prevProblem => ({
            ...prevProblem,
            time_limit: value
        }));
    }

    const handleMemoryChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (value > MAX_MEMORY_LIMIT) value = MAX_MEMORY_LIMIT;
        if (value < MIN_MEMORY_LIMIT) value = MIN_MEMORY_LIMIT;
        setProblem(prevProblem => ({
            ...prevProblem,
            memory_limit: value
        }));
    }

    const handleSubmitClick = () => {
        setLoading(true);
        handleSubmit();
        setLoading(false);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="create-problem-modal-title"
            aria-describedby="create-problem-modal-description"
        >
            <Box sx={style}>
                <h1 id="create-problem-modal-title">{isEditing ? "Update problem" : "Create problem"}</h1>
                <TextField
                    label="Title"
                    name="title"
                    value={problem.title}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <div style={{ margin: '5px 0px' }}>
                    <Typography variant="h5" component="label" gutterBottom >
                        Description
                    </Typography>
                </div>
                <TextEditor
                    text={problem.description}
                    handleTextChange={handleDescriptionChange}
                />
                <div style={{ margin: '5px 0px' }}>
                    <Typography variant="h5" component="label" gutterBottom >
                        Guide input
                    </Typography>
                </div>
                <TextEditor
                    text={problem.guide_input}
                    handleTextChange={handleGuideInputChange}
                />
                <div style={{ margin: '5px 0px' }}>
                    <Typography variant="h5" component="label" gutterBottom >
                        Guide output
                    </Typography>
                </div>
                <TextEditor
                    text={problem.guide_output}
                    handleTextChange={handleGuideOutputChange}
                />
                <div className={styles.custom_btn}>
                    <TextField
                        label="Time Limit (ms)"
                        name="time_limit"
                        value={problem.time_limit}
                        onChange={handleTimeChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                </div>
                <div className={styles.custom_btn}>
                    <TextField
                        label="Memory Limit (MB)"
                        name="memory_limit"
                        value={problem.memory_limit}
                        onChange={handleMemoryChange}
                        fullWidth
                        margin="normal"
                        type="number"
                    />
                </div>
                <Category
                    selectedCategories={selectedCategories}
                    handleAddCategory={handleAddCategory}
                    handleDeleteCategory={handleDeleteCategory}
                />

                <div className={styles.custom}>
                    <Button variant="contained" color="primary" onClick={handleSubmitClick} fullWidth sx={{ maxWidth: '200px' }}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                    >
                        Submit
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default ProblemModal;
