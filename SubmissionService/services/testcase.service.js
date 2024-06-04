const testcases = require("../models").testcases;

async function getTestcase(problem_id) {
    return await testcases.findAll({
        raw: true,
        where: {
            problem_id: problem_id
        },
    });
}

module.exports = {
    getTestcase
}