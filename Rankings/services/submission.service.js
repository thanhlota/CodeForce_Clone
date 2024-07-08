const submissions = require("../models").submissions;

async function create(user_id, contest_id, problem_id, verdict) {
    const submission = submissions.build({
        user_id,
        contest_id,
        problem_id,
        verdict
    })
    return await submission.save();
}

async function getSubmissions(filter = {}) {
    return await rankings.findAll({
        where: filter,
    });
}
module.exports = {
    create,
    getSubmissions
}