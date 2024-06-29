const problems = require("../models").problems;
const categories = require("../models").categories;
const contests = require("../models").contests;
const testcases = require("../models").testcases;

async function create(contest_id, title, description, guide_input, guide_output, time_limit, memory_limit, option = {}) {
    return await problems.create({
        contest_id, title, description, guide_input, guide_output, time_limit, memory_limit
    }, option);
}

async function getById(id) {
    return await problems.findByPk(id, {
        include: [{
            model: categories,
            through: { attributes: [] },
            required: false
        },
        {
            model: testcases,
            where: {
                isSample: true
            },
            attributes: ['input', 'expected_output'],
            required: false
        }
        ]
    });
}

async function adminGetById(id) {
    return await problems.findByPk(id, {
        include: [{
            model: categories,
            through: { attributes: [] },
            required: false
        },
        {
            model: testcases,
            attributes: ['id', 'input', 'expected_output', 'isSample'],
            required: false
        }
        ]
    });
}

async function getProblems(filter = {}) {
    return await problems.findAll({
        where: filter,
        include: [
            {
                model: categories,
                attributes: ['type'],
                through: { attributes: [] },
                required: false
            },
            {
                model: contests,
                attributes: ['id', 'name'],
                required: false
            }
        ]
    });
}

async function getProblem(filter = {}) {
    return await problems.findOne({
        where: filter,
        include: {
            model: categories,
            through: { attributes: [] },

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
    update,
    adminGetById
}