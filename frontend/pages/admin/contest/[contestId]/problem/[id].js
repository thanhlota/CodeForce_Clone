import AdminLayout from "@/components/layout/AdminLayout"
import { authorizeAdmin } from "@/utils/auth";
import { useState, useRef, useEffect } from "react";
import problemService from "@/services/problem.service";
import { useRouter } from "next/router";
import {
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
    Checkbox,
    FormControlLabel,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Modal,
} from '@mui/material';
import Category from "@/components/problems/Category.jsx";
import dynamic from 'next/dynamic';
const TextEditor = dynamic(() => import('@/components/problems/TextEditor').then((mod) => mod.default), { ssr: false, loading: () => <p>Editor loading ...</p> });
import styles from "@/components/problems/ProblemModal.module.css";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MAX_TIME_LIMIT = 5000;
const MIN_TIME_LIMIT = 0;
const MAX_MEMORY_LIMIT = 500;
const MIN_MEMORY_LIMIT = 0;

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const TCList = ({ problem_id, testCases, setTestCases, setSnackbarMessage, setSnackbarOpen, setSnackbarSeverity }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTestCase, setSelectedTestCase] = useState({ input: '', expected_output: '', isSample: false });
    const [currentIndex, setCurrentIndex] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddTestCase = () => {
        setSelectedTestCase({ input: '', expected_output: '', isSample: false });
        setIsEditMode(false);
        setOpenModal(true);
    };

    const handleDeleteTestCase = (index) => {
        setCurrentIndex(index);
        setOpenDeleteDialog(true);
    };

    const handleEditTestCase = (index) => {
        setCurrentIndex(index);
        setSelectedTestCase(testCases[index]);
        setIsEditMode(true);
        setOpenModal(true);
    };

    const confirmDeleteTestCase = async () => {
        try {
            setLoading(true);
            const res = await problemService.deleteTestcase(testCases[currentIndex].id);
            if (res.status == 200) {
                const newTestCases = testCases.filter((_, i) => i !== currentIndex);
                setTestCases(newTestCases);
                setOpenDeleteDialog(false);
                setSnackbarMessage("Delete test case successfully!");
                setSnackbarSeverity("success");
            }
            else {
                setSnackbarMessage("Delete test case failed!");
                setSnackbarSeverity("error");
            }
        }
        catch (e) {
            onsole.log("ERROR", e);
            setSnackbarMessage("Delete test case failed!");
            setSnackbarSeverity("error");
        }
        setLoading(false);
        setSnackbarOpen(true);
    };

    const handleModalChange = (field, value) => {
        setSelectedTestCase({ ...selectedTestCase, [field]: value });
    };

    const handleSaveTestCase = async () => {
        const info = { ...selectedTestCase, problem_id };
        setLoading(true);
        try {
            if (isEditMode) {
                const res = await problemService.updateTestcase(info);
                if (res.status == 200) {
                    const newTestCases = [...testCases];
                    newTestCases[currentIndex] = selectedTestCase;
                    setTestCases(newTestCases);
                    setSnackbarMessage("Update test case successfully!");
                    setSnackbarSeverity("success");
                    setOpenModal(false);
                }
                else {
                    setSnackbarMessage("Update test case failed!");
                    setSnackbarSeverity("error");
                }
            } else {
                const res = await problemService.addTestcase(info);
                if (res.status == 200) {
                    const { testcase } = await res.json();
                    setTestCases([...testCases, testcase]);
                    setSnackbarMessage("Add test case successfully!");
                    setSnackbarSeverity("success");
                    setOpenModal(false);
                }
                else {
                    setSnackbarMessage("Add test case failed!");
                    setSnackbarSeverity("error");
                }
            }

        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage("Save test case failed!");
            setSnackbarSeverity("error");
        }
        setLoading(false);
        setSnackbarOpen(true);
    };

    return (
        <>
            <div style={{ margin: '5px 0px' }}>
                <Typography variant="h5" component="label">
                    Testcases
                </Typography>
            </div>
            <div>
                {testCases.map((testCase, index) => (
                    <div key={index}>
                        <div style={{ margin: '5px 0px' }}>
                            <Typography variant="h5" component="label" gutterBottom>
                                Input
                            </Typography>
                        </div>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={testCase.input}
                            sx={{ mb: 2 }}
                            multiline
                            rows={5}
                            disabled
                        />
                        <div style={{ margin: '5px 0px' }}>
                            <Typography variant="h5" component="label" gutterBottom>
                                Output
                            </Typography>
                        </div>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={testCase.expected_output}
                            sx={{ mb: 2 }}
                            multiline
                            rows={5}
                            disabled
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={testCase.isSample}
                                    disabled={true}
                                    color="primary"
                                />
                            }
                            label="Is Sample Test Case"
                        />
                        <IconButton onClick={() => handleDeleteTestCase(index)} aria-label="delete" color="error">
                            <DeleteIcon />
                        </IconButton>
                        <IconButton onClick={() => handleEditTestCase(index)} aria-label="edit" color="primary">
                            <EditIcon />
                        </IconButton>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                <AddCircleOutlineIcon color="primary" sx={{ cursor: 'pointer' }} onClick={handleAddTestCase} />
            </div>

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this test case?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteTestCase}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />
                        }
                        color="primary"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        {isEditMode ? 'Edit Test Case' : 'Create Test Case'}
                    </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Input"
                        value={selectedTestCase.input}
                        onChange={(e) => handleModalChange('input', e.target.value)}
                        sx={{ mb: 2 }}
                        multiline
                        rows={5}
                    />
                    <TextField
                        variant="outlined"
                        fullWidth
                        label="Expected Output"
                        value={selectedTestCase.expected_output}
                        onChange={(e) => handleModalChange('expected_output', e.target.value)}
                        sx={{ mb: 2 }}
                        multiline
                        rows={5}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedTestCase.isSample}
                                onChange={() => handleModalChange('isSample', !selectedTestCase.isSample)}
                                color="primary"
                            />
                        }
                        label="Is Sample Test Case"
                    />
                    <Button
                        onClick={handleSaveTestCase}
                        disabled={loading}
                        startIcon={loading && <CircularProgress size={20} />}
                        variant="contained" color="primary"
                    >
                        Save
                    </Button>
                </Box>
            </Modal>
        </>
    );
}

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default function ProblemPage() {
    const router = useRouter();
    const { id } = router.query;
    const [activeTab, setActiveTab] = useState(0);
    const initialDetail = useRef(null);
    const hasFetched = useRef(false);
    const [detail, setDetail] = useState({
        title: '',
        description: '',
        guide_input: '',
        guide_output: '',
        time_limit: '',
        memory_limit: '',
        categories: [],
    });

    const initialTC = useRef(null);
    const [tc, setTC] = useState([]);
    const [isDetailUpdated, setIsDetailUpdated] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(false);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleAddCategory = (category) => {
        if (detail?.categories && !detail.categories.includes(category)) {
            setDetail((prevDetail) => (
                {
                    ...prevDetail,
                    categories: [...prevDetail.categories, category]
                }
            )
            );
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        if (detail.categories)
            setDetail((prevDetail) => (
                {
                    ...prevDetail,
                    categories: detail.categories.filter((category) => category !== categoryToDelete)
                }
            )
            );
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetail(prevDetail => ({
            ...prevDetail,
            [name]: value
        }));
    };


    const handleDescriptionChange = (value) => {
        setDetail(prevDetail => ({
            ...prevDetail,
            description: value
        }));
    };

    const handleGuideInputChange = (value) => {
        setDetail(prevDetail => ({
            ...prevDetail,
            guide_input: value
        }));
    };

    const handleGuideOutputChange = (value) => {
        setDetail(prevDetail => ({
            ...prevDetail,
            guide_output: value
        }));
    };


    const handleTimeChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (value > MAX_TIME_LIMIT) value = MAX_TIME_LIMIT;
        if (value < MIN_TIME_LIMIT) value = MIN_TIME_LIMIT;
        setDetail(prevDetail => ({
            ...prevDetail,
            time_limit: value
        }));
    }

    const handleMemoryChange = (e) => {
        let value = parseInt(e.target.value, 10);
        if (value > MAX_MEMORY_LIMIT) value = MAX_MEMORY_LIMIT;
        if (value < MIN_MEMORY_LIMIT) value = MIN_MEMORY_LIMIT;
        setDetail(prevDetail => ({
            ...prevDetail,
            memory_limit: value
        }));
    }

    const handleDetailUpdate = async () => {
        try {
            const info = { ...detail, id };
            setLoading(true);
            const res = await problemService.updateProblem(info);
            if (res.status == 200) {
                setSnackbarMessage("Update detail successfully!");
                setSnackbarSeverity("success");
                initialDetail.current = detail;
                setIsDetailUpdated(false);
            }
            else {
                setSnackbarMessage("Update detail failed!");
                setSnackbarSeverity("error");
            }
        }
        catch (e) {
            console.log("ERROR", e);
            setSnackbarMessage("Update detail failed!");
            setSnackbarSeverity("error");
        }
        setLoading(false);
        setSnackbarOpen(true);
    };

    const fetchProblem = async () => {
        try {
            const res = await problemService.adminGetProblemById(id);
            if (res?.problem) {
                const { title, description, guide_input, guide_output, time_limit, memory_limit, categories } = res.problem;
                const newCategories = categories.map((item) => item.type);
                setDetail({
                    title,
                    description,
                    guide_input,
                    guide_output,
                    time_limit,
                    memory_limit,
                    categories: newCategories
                });
                initialDetail.current = {
                    title,
                    description,
                    guide_input,
                    guide_output,
                    time_limit,
                    memory_limit,
                    categories: newCategories
                }

                if (res.problem.testcases) {
                    setTC(res.problem.testcases);
                    initialTC.current = res.problem.testcases;
                }
            }
        }
        catch (e) {
            console.log("ERROR", e)
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            fetchProblem();
            hasFetched.current = true;
        }
    }, []);

    useEffect(() => {
        if (initialDetail.current) {
            if (initialDetail.current.title != detail.title ||
                initialDetail.current.description != detail.description ||
                initialDetail.current.guide_input != detail.guide_input ||
                initialDetail.current.guide_output != detail.guide_output ||
                initialDetail.current.time_limit != detail.time_limit ||
                initialDetail.current.memory_limit != detail.memory_limit
            ) {
                setIsDetailUpdated(true);
                return;
            }
            if (initialDetail.current.categories.length !== detail.categories.length) {
                setIsDetailUpdated(true);
                return;
            }
            for (let i = 0; i < detail.categories.length; i++) {

                if (!initialDetail.current.categories.includes(detail.categories[i])) {
                    setIsDetailUpdated(true);
                    return;
                }
            }
        }
        setIsDetailUpdated(false);
    }, [detail]);

    return (
        <AdminLayout>
            <Box sx={{ width: '100%', backgroundColor: '#FFF' }}>
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab label="Detail" />
                    <Tab label="Test Case" />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                    <TextField
                        label="Title"
                        name="title"
                        value={detail?.title}
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
                        text={detail?.description}
                        handleTextChange={handleDescriptionChange}
                    />
                    <div style={{ margin: '5px 0px' }}>
                        <Typography variant="h5" component="label" gutterBottom >
                            Guide input
                        </Typography>
                    </div>
                    <TextEditor
                        text={detail?.guide_input}
                        handleTextChange={handleGuideInputChange}
                    />
                    <div style={{ margin: '5px 0px' }}>
                        <Typography variant="h5" component="label" gutterBottom >
                            Guide output
                        </Typography>
                    </div>
                    <TextEditor
                        text={detail?.guide_output}
                        handleTextChange={handleGuideOutputChange}
                    />
                    <div className={styles.custom_btn}>
                        <TextField
                            label="Time Limit (ms)"
                            name="time_limit"
                            value={detail?.time_limit}
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
                            value={detail?.memory_limit}
                            onChange={handleMemoryChange}
                            fullWidth
                            margin="normal"
                            type="number"
                        />
                    </div>
                    <Category
                        selectedCategories={detail?.categories ? detail.categories : []}
                        handleAddCategory={handleAddCategory}
                        handleDeleteCategory={handleDeleteCategory}
                    />
                    <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'center', alignItems: 'center' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={!isDetailUpdated || loading}
                            onClick={handleDetailUpdate}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            Update
                        </Button>
                    </div>
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                    <TCList
                        problem_id={id}
                        testCases={tc}
                        setTestCases={setTC}
                        setSnackbarMessage={setSnackbarMessage}
                        setSnackbarSeverity={setSnackbarSeverity}
                        setSnackbarOpen={setSnackbarOpen}
                    />
                </TabPanel>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </AdminLayout>
    )
}

export const getServerSideProps = authorizeAdmin;