const problems = require("../models").problems;
const categories = require("../models").categories;
async function create(contest_id, title, description, guide_input, guide_output, time_limit, memory_limit, option = {}) {
    return await problems.create({
        contest_id, title, description, guide_input, guide_output, time_limit, memory_limit
    }, option);
}

async function getById(id) {
    return await problems.findByPk(id, {
        include: {
            model: categories,
            through: { attributes: [] }
        }
    });
}

async function getProblems(filter = {}) {
    return await problems.findAll({
        where: filter,
        include: {
            model: categories,
            through: { attributes: [] }
        }
    });
}

async function getProblem(filter = {}) {
    return await problems.findOne({
        where: filter,
        include: {
            model: categories,
            through: { attributes: [] }
        }
    });
}

async function remove(problem) {
    return await problem.destroy();
}

async function update(problem, updateFields = {}) {
    for (let [key, value] of Object.entries(updateFields)) {
        problem[key] = value;
    }
    return await problem.save();
}

module.exports = {
    create,
    getById,
    getProblem,
    getProblems,
    remove,
    update
}