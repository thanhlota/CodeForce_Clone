const problems = require("../models").problems;

async function create(title, description, guide_input, guide_ouput, time_limit, memory_limit) {
    const problem = problems.build({
        title, description, guide_input, guide_ouput, time_limit, memory_limit
    })
    return await problem.save();
}

async function getById(id) {
    return await problems.findByPk(id);
}

async function getproblems(filter = {}) {
    return await problems.findAll({
        where: filter,
    });
}

async function getContest(filter = {}) {
    return await problems.findOne({
        where: filter,
    });
}

async function remove(user) {
    return await user.destroy();
}

async function update(contest, updateFields = {}) {
    for (let [key, value] of Object.entries(updateFields)) {
        contest[key] = value;
    }
    return await language.save();
}

module.exports = {
    create,
    getById,
    getContest,
    getproblems,
    remove,
    update
}