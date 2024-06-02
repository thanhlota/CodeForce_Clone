const submissions = require("../models").submissions;
const results = require("../models").results;

async function create(user_id, problem_id, code, language) {
    const submission = submissions.build({
        user_id,
        problem_id,
        code,
        language
    });
    return await submission.save();
}

async function getById() {
    return await submissions.findByPk(id, {
        include: {
            model: results,
            through: { attributes: [] }
        }
    });
}

async function getSubmissions(filter = {}) {
    return await submissions.findAll({
        where: filter,
    });
}

module.exports = {
    create,
    getById,
    getSubmissions
}