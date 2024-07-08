import React, { useState } from 'react';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  TextField,
  IconButton,
  Box,
  Modal,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import styles from "./ContestTable.module.css";
import submitService from '@/services/submit.service';

const getElapsedTime = (contestStartTime, submissionTime) => {
  const start = moment(contestStartTime);
  const submission = moment(submissionTime);
  const duration = moment.duration(submission.diff(start));

  const hours = String(duration.hours()).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const SubmissionModal = ({ open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={styles.modal}>
        <div className={styles.wrapper}>
          <div className={styles.inner}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Text in a modal
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

function sortedScores(allProblemIds, userProblems) {
  return allProblemIds.map(problemId => {
    if (userProblems) {
      const userProblem = userProblems.find(problem => problem.id == problemId);
      return {
        id: problemId,
        verdict: userProblem ? (userProblem.verdict == "pass" ? 10 : 0) : '-'
      };
    }
    else {
      return {
        id: problemId,
        verdict: '-'
      }
    }
  });
}

const ContestRankings = ({ scores, problems }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { contestId } = router.query;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleScoreClick = async (problemId, userId, verdict) => {
    try {
      if (verdict != "-") {
        const { submissions } = await submitService.getByUserAndProblem(userId, 16);
        console.log('submissions', submissions);
        handleOpen();
      }
    }
    catch (e) {
      console.log("ERROR", e);
    }
  };

  const filteredscores = scores.filter((score) =>
    score.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Contest Rankings
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search scores"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mr: 2, backgroundColor: '#fff' }}
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
              {problems.map((problem, index) => (
                <TableCell key={index} sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  <Link sx={{ cursor: 'pointer' }} onClick={() => router.push(`/contests/${contestId}/problem/${problem}`)} >
                    {alphabet[index]}
                  </Link>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredscores.map((score, index) => (
              <TableRow key={score.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{score.userName}</TableCell>
                {sortedScores(problems, score?.problems).map(problem => (
                  <TableCell
                    key={problem.id}
                  >
                    <span
                      className={problem.verdict == "10" ? styles.pass : styles.fail}
                      onClick={() => { handleScoreClick(problem.id, score.id, problem.verdict) }}
                    > {problem.verdict}</span>
                  </TableCell>
                ))}
                <TableCell>
                  <span className={styles.score}>{score.score}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <SubmissionModal open={open} handleClose={handleClose} />
    </Container>
  );
};

export default ContestRankings;