import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import styles from './ProblemList.module.css';

export default function CustomTable({ data }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter((row) =>
        row.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.custom_table}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.search_bar}
                />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="customized table">
                    <TableHead>
                        <TableRow className={styles.table_row} >
                            <TableCell className={styles.table_header}>Problem Name</TableCell>
                            <TableCell align="right" className={styles.table_header}>Category</TableCell>
                            <TableCell align="right" className={styles.table_header}>Contest Name</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map((row, index) => (
                            <TableRow
                                key={row.id}
                                sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'inherit' }}
                                className={styles.table_row}
                            >
                                <TableCell component="th" scope="row" className={styles.custom_cell}>
                                    <span className={styles.problem}>
                                        {row.title}
                                    </span>
                                    <div className={styles.limit_container}>
                                        <span>standard input/output</span>
                                        <span styles={styles.limit}>{row.limit}</span>
                                    </div>
                                </TableCell>
                                <TableCell align="right" className={styles.category}>{row.categories}</TableCell>
                                <TableCell align="right" className={styles.contest}>{row.contest.name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

