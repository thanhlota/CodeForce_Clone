// const testcases = require("../models").testcases;
const CONTEST_URI = `http://${process.env.CONTEST_URI}/api/testcase/all`

async function getTestcase(problem_id) {
    const reponse = await fetch(CONTEST_URI + `?pq=${problem_id}`, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    })
    return await reponse.json();
}

module.exports = {
    getTestcase
}