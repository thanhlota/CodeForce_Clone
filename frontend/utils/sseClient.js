const SubmissionUri = process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI;
const sseClient = (submissionIds, handleEvent) => {
    const format = submissionIds.join(',');
    const eventSource = new EventSource(`http://${SubmissionUri}/api/submission/status?submissionIds=${format}`);
    eventSource.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        const { submissionId, verdict } = data;
        handleEvent(submissionId, verdict);
    }

    eventSource.onerror = (err) => {
        console.error("ERROR WITH SSE:", err.message);
    }
}

export default sseClient;