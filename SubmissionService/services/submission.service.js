const submissions = require("../models").submissions;
const results = require("../models").results;
const CodeStatus = require("../enum/CodeStatus");

async function create(user_id, problem_id, code, language, contest_id) {
    const submission = submissions.build({
        user_id,
        problem_id,
        code,
        language,
        contest_id,
        verdict: CodeStatus.TT,
        createdAt: new Date()
    });
    return await submission.save();
}

async function getById(id) {
    return await submissions.findByPk(id, {
        include: {
            model: results,
            required: false
        },
    });
}

async function getSubmissions(filter = {}, limit, offset) {
    const { count, rows } = await submissions.findAndCountAll({
        where: filter,
        order: [['createdAt', 'DESC']],
        limit,
        offset
    });
    return { submissions: rows, totalSubmissions: count };
}

async function update(id, updateFields = {}) {
    const submission = await submissions.findByPk(id);
    for (let [key, value] of Object.entries(updateFields)) {
        submission[key] = value;
    }
    return await submission.save();
}


module.exports = {
    create,
    getById,
    getSubmissions,
    update
}