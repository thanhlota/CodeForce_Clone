const contests = require("../models").contests;
const problems = require("../models").problems;

async function create(name, start_time, end_time) {
    const contest = contests.build({
        name,
        start_time,
        end_time
    })
    return await contest.save();
}

async function getById(id) {
    return await contests.findByPk(id, {
        include: [
            {
                model: problems,
                attributes: ['id', 'title', 'time_limit', 'memory_limit'],
                required: false
            }
        ]
    });
}

async function getContests(filter = {}) {
    return await contests.findAll({
        where: filter,
    });
}

async function getContest(filter = {}) {
    return await contests.findOne({
        where: filter,
    });
}

async function remove(contest) {
    return await contest.destroy();
}

async function update(contest, updateFields = {}) {
    for (let [key, value] of Object.entries(updateFields)) {
        contest[key] = value;
    }
    return await contest.save();
}

module.exports = {
    create,
    getById,
    getContest,
    getContests,
    remove,
    update
}