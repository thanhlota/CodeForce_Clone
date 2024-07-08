import { useCallback, useState } from 'react';
import {
  Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, TextField, IconButton, Box
} from '@mui/material';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';

const ContestProblems = ({ problems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProblems = problems.filter((problem) =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const router = useRouter();

  const goToProblem = useCallback((id) => {
    router.push(`/contests/1/problem/${id}`)
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {
            (problems.length && problems[0].contest.name) ?
              problems[0].contest.name
              :
              null
          }
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search Problems"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2 }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Problem Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Time Limit</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Memory Limit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProblems.map((problem, index) => (
              <TableRow key={problem.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>
                  <Link sx={{ cursor: 'pointer' }} onClick={() => goToProblem(problem.id)}>
                    {alphabet[index]}
                  </Link>
                </TableCell>
                <TableCell>{problem.title}</TableCell>
                <TableCell>{problem.time_limit / 1000 + ' s'}</TableCell>
                <TableCell>{problem.memory_limit + " MB"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ContestProblems;