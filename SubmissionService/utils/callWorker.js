const WORKER_URL = "http://192.168.172.82:7777/api/process-job";

async function callWorker( submission_id, code, lang, testcases) {
    const data = {
        submission_id,
        code,
        lang,
        testcases
    };
    return await fetch(WORKER_URL, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
}

module.exports = callWorker;
