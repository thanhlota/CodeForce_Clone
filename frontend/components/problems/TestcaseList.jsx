
import { Typography, Box, TextField, IconButton } from "@mui/material";
import { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const TestcaseList = ({ testCases, setTestCases }) => {
    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', expected_output: '' }]);
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleDeleteTestCase = (index) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(newTestCases);
    };

    return (
        <>
            <div style={{ margin: '5px 0px' }}>
                <Typography variant="h5" component="label"  >
                    Testcases
                </Typography>
            </div>
            <div style={{ marginTop: 16, maxHeight: 200, overflowY: 'auto' }}>
                {testCases.map((testCase, index) => (
                    <Box key={index} sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 2 }}>
                        <TextField
                            label="Input"
                            variant="outlined"
                            fullWidth
                            value={testCase.input}
                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            sx={{ mb: 2 }}
                            multiline
                            rows={1}
                        />
                        <TextField
                            label="Output"
                            variant="outlined"
                            fullWidth
                            value={testCase.expected_output}
                            onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                            sx={{ mb: 2 }}
                            multiline
                            rows={1}
                        />
                        <IconButton onClick={() => handleDeleteTestCase(index)} aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }} >
                <AddCircleOutlineIcon color="primary" sx={{ cursor: 'pointer' }} onClick={handleAddTestCase} />
            </div>
        </>
    )
}
export default TestcaseList;