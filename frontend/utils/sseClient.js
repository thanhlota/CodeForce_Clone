const SubmissionUri = process.env.NEXT_PUBLIC_SUBMISSION_SERVICE_URI;

const sseClient = (submissionIds, originalSubmissions, setSubmission) => {
    const format = submissionIds.map((item) => item.id).join(',');
    const eventSource = new EventSource(`http://${SubmissionUri}/api/submission/status?submissionIds=${format}`);
    console.log('SSE CONNECTED!');
    eventSource.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data?.type == "disconnect") {
            eventSource.close();
            console.log('SSE disconnect by server!');
            return;
        }
        const { submissionId, verdict } = data;
        const updatedSubmissions = [...originalSubmissions];
        const submissionIndex = updatedSubmissions.findIndex(submission => submission.id == submissionId);
        if (submissionIndex !== -1) {
            updatedSubmissions[submissionIndex].verdict = verdict;
            setSubmission(updatedSubmissions);
        }
    }

    eventSource.onerror = (err) => {
        console.error("ERROR WITH SSE:", err);
        eventSource.close();
    }

    return eventSource;
}

export default sseClient;