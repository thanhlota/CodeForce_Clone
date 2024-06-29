const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ProblemService = require("../services/problem.service");
const TestCaseService = require("../services/testcase.service");
const { Op } = require("sequelize");

async function create(req, res) {
    try {
        const { problem_id, input, expected_output, isSample } = req.body;

        if (!problem_id || !input || !expected_output) {
            return new ErrorHandler(
                ERROR.MISSING_TESTCASE_INFO.status,
                ERROR.MISSING_TESTCASE_INFO.message
            ).httpResponse(res);
        }
        const problem = await ProblemService.getById(problem_id);
        if (!problem) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_PROBLEM.status,
                ERROR.NON_EXISTED_PROBLEM.message
            ).httpResponse(res);
        }
        const testcase = await TestCaseService.create(problem_id, input, expected_output, isSample);
        res.status(200).send({
            testcase
        })
    }
    catch (e) {
        console.log("Testcase create failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }

}

async function remove(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_TESTCASE.status,
                ERROR.NON_EXISTED_TESTCASE.message
            ).httpResponse(res);
        }
        const testcase = await TestCaseService.getById(id);
        if (!testcase) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_TESTCASE.status,
                ERROR.NON_EXISTED_TESTCASE.message
            ).httpResponse(res);
        }
        await TestCaseService.remove(testcase);
        res.status(200).send({
            message: "Testcase removed successfully!"
        })
    }
    catch (e) {
        console.log("Testcase remove failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_TESTCASE.status,
                ERROR.NON_EXISTED_TESTCASE.message
            ).httpResponse(res);
        }
        const testcase = await TestCaseService.getById(id);
        if (!testcase) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_TESTCASE.status,
                ERROR.NON_EXISTED_TESTCASE.message
            ).httpResponse(res);
        }
        const { isSample, input, expected_output } = req.body;
        if (!input || !expected_output) {
            return new ErrorHandler(
                ERROR.MISSING_TESTCASE_INFO.status,
                ERROR.MISSING_TESTCASE_INFO.message
            ).httpResponse(res);
        }

        const newTestCase = await TestCaseService.update(testcase, {
            isSample, input, expected_output
        })
        return res.status(200).send({
            testcase: newTestCase
        })
    }
    catch (e) {
        console.log("Testcase update failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getTestcases(req, res) {
    try {
        const { pq } = req.query;
        const searchConditions = [];
        if (pq) searchConditions.push({ problem_id: pq });
        const filter = {
            [Op.and]: searchConditions
        }
        const testcases = await TestCaseService.getTestcases(filter);

        return res.status(200).send({
            testcases
        })
    }
    catch (e) {
        console.log("Get testcases failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    create,
    remove,
    update,
    getTestcases
}