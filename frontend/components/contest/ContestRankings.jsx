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
  Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/router';
import styles from "./ContestTable.module.css";
import submitService from '@/services/submit.service';
import moment from 'moment';
import TestModal from '@/components/submit/TestModal';
import { useSelector } from 'react-redux';
import { userIdSelector } from '@/redux/reducers/user.reducer';
import Verdict from "@/enum/Verdict";

const getElapsedTime = (contestStartTime, submissionTime) => {
  const start = moment(contestStartTime);
  const submission = moment(submissionTime);
  const duration = moment.duration(start.diff(submission));
  const hours = String(duration.hours()).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const SubmissionModal = ({ openDetailModal, contestTime, submissions, open, handleClose, userId, endTime }) => {
  const currentUserId = useSelector(userIdSelector);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState(null);

  const handleGetDetail = (submissionId) => {
    const currentTime = new Date();
    if (currentTime <= endTime && currentUserId != userId) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Contest has not ended yet!");
      setOpenSnackbar(true);
    }
    else {
      openDetailModal(submissionId);
    }
  }

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              {
                submissions.map((item) => {
                  return (
                    <div>
                      {contestTime && <span className={styles.time}>{getElapsedTime(contestTime, item.createdAt)}</span>}
                      <span className={item.verdict == Verdict.AC ? styles.pass : styles.fail}>{item.verdict}</span>
                      <span> → </span>
                      <span>
                        <Link style={{ cursor: 'pointer' }} onClick={() => handleGetDetail(item.id)}>
                          {item.id}
                        </Link>
                      </span>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </Box>
      </Modal>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

function sortedScores(allProblemIds, userProblems) {
  return allProblemIds.map(problemId => {
    if (userProblems) {
      const userProblem = userProblems.find(problem => problem.id == problemId);
      return {
        id: problemId,
        verdict: userProblem ? (userProblem.verdict == Verdict.AC ? 10 : 0) : '-'
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

const ContestRankings = ({ contestTime, scores, problems, endTime }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const [open, setOpen] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [srcCode, setSrcCode] = useState(null);
  const [results, setResults] = useState(null);
  const [language, setLanguage] = useState(null);
  const [userId, setUserId] = useState(null);

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
        setUserId(userId);
        const { submissions } = await submitService.getByUserAndProblem(userId, problemId);
        setSubmissions(submissions);
        handleOpen();
      }
    }
    catch (e) {
      console.log("ERROR", e);
    }
  };

  const openDetailModal = async (submissionId) => {
    try {
      if (submissionId) {
        const { submission } = await submitService.getById(submissionId);
        if (submission?.code) {
          setSrcCode(submission.code);
        }
        if (submission?.language) {
          setLanguage(submission.language);
        }
        if (submission?.results) {
          setResults(submission.results);
        }
        setOpen(false);
        setDetailOpen(true);
      }
    }
    catch (e) {
      console.log("ERROR", e);
    }
  }

  const handleDetailClose = () => {
    setDetailOpen(false);
  }

  const filteredscores = scores.filter((score) =>
    score.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('filteredscores', filteredscores);
  return (
    <Container maxWidth="lg" className={styles.container}>
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
      <SubmissionModal
        contestTime={contestTime}
        open={open}
        handleClose={handleClose}
        submissions={submissions}
        openDetailModal={openDetailModal}
        userId={userId}
        endTime={endTime}
      />
      <TestModal
        srcCode={srcCode}
        results={results}
        language={language}
        open={detailOpen}
        handleClose={handleDetailClose}
      />
    </Container>
  );
};

export default ContestRankings;