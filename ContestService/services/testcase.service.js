const testcases = require("../models").testcases;

async function create(problem_id, input, expected_output, isSample, option = {}) {
    return await testcases.create(
        {
            problem_id, input, expected_output, isSample
        },
        option
    )
}

async function getById(id) {
    return await testcases.findByPk(id);
}

async function getTestcases(filter = {}) {
    return await testcases.findAll({
        where: filter,
    });
}

async function getTestcase(filter = {}) {
    return await testcases.findOne({
        where: filter,
    });
}

async function remove(testcase) {
    return await testcase.destroy();
}

async function update(testcase, updateFields = {}) {
    for (let [key, value] of Object.entries(updateFields)) {
        testcase[key] = value;
    }
    return await testcase.save();
}

module.exports = {
    create,
    getById,
    getTestcase,
    getTestcases,
    remove,
    update
}