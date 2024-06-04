const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const SubmissionService = require("../services/submission.service");
const TestcaseService = require("../services/testcase.service");
const ResultService = require("../services/result.service");
const { Op } = require("sequelize");
const callWorker = require("../utils/callWorker");
const Publisher = require("../queues/publisher");

async function create(req, res) {
    try {
        const { user_id, problem_id, code, language } = req.body;
        if (!user_id || !problem_id || !code || !language) {
            return new ErrorHandler(
                ERROR.MISSING_SUBMISSION_INFO.status,
                ERROR.MISSING_SUBMISSION_INFO.message
            ).httpResponse(res);
        }
        const submission = await SubmissionService.create(user_id, problem_id, code, language);
        if (submission && submission.id) {
            const testcases = await TestcaseService.getTestcase(problem_id);
            const publisher = Publisher.getInstance();
            const job = {
                submission_id: submission.id,
                code,
                lang: language,
                testcases
            }
            publisher.pushJob(job);
            return res.status(200).send({
                submission: submission
            })
        }
    }
    catch (e) {
        console.log("Create submission failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_SUBMISSION.status,
                ERROR.NON_EXISTED_SUBMISSION.message
            ).httpResponse(res);
        }
        const submission = await SubmissionService.getById(id);
        if (!submission) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_SUBMISSION.status,
                ERROR.NON_EXISTED_SUBMISSION.message
            ).httpResponse(res);
        }
        return res.status(200).send({
            submission
        })

    }
    catch (e) {
        console.log("Get submission failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getSubmissions(req, res) {
    try {
        const { uq } = req.query;
        const searchConditions = [];
        if (uq) searchConditions.push({ user_id: uq });
        const filter = {
            [Op.and]: searchConditions
        }
        const submissions = await SubmissionService.getSubmissions(filter);
        return res.status(200).send({
            submissions
        })
    }
    catch (e) {
        console.log("Get submissions failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    create,
    getById,
    getSubmissions,
}