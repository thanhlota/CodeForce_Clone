const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const SubmissionService = require("../services/submission.service");
const TestcaseService = require("../services/testcase.service");
const { Op } = require("sequelize");
const Publisher = require("../queues/publisher");
const Client = require("../sse/Client.js");
const SseServer = require("../sse/SseServer.js");
const PAGE_LIMIT = 20;

async function create(req, res) {
    try {
        const { user_id, user_name, problem_id, contest_id, code, language, mem, time, ongoingContest } = req.body;
        if (!user_id || !user_name || !problem_id || !code || !language || !contest_id || !mem || !time) {
            return new ErrorHandler(
                ERROR.MISSING_SUBMISSION_INFO.status,
                ERROR.MISSING_SUBMISSION_INFO.message
            ).httpResponse(res);
        }
        const submission = await SubmissionService.create(user_id, user_name, problem_id, code, language, contest_id);
        if (submission && submission.id) {
            const { testcases } = await TestcaseService.getTestcase(problem_id);
            const publisher = Publisher.getInstance();
            const job = {
                contest_id,
                problem_id,
                submission_id: submission.id,
                user_id,
                user_name,
                mem,
                time,
                code,
                lang: language,
                testcases,
                ongoingContest
            }
            if (testcases && testcases?.length)
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
        let { uq, ctq, pq, page } = req.query;
        const searchConditions = [];
        if (uq) searchConditions.push({ user_id: uq });
        if (ctq) {
            searchConditions.push({ contest_id: ctq });
        }
        if (pq) searchConditions.push({ problem_id: pq })
        if (!page) {
            page = 1;
        }
        const offset = (page - 1) * PAGE_LIMIT;
        const filter = {
            [Op.and]: searchConditions
        }
        if (uq && pq) {
            const { submissions } = await SubmissionService.getSubmissions(filter);
            return res.status(200).send({
                submissions
            })
        }
        else {
            const { submissions, totalSubmissions } = await SubmissionService.getSubmissions(filter, PAGE_LIMIT, offset);
            return res.status(200).send({
                filter: searchConditions,
                submissions,
                totalPages: Math.ceil(totalSubmissions / PAGE_LIMIT)
            })
        }
    }
    catch (e) {
        console.log("Get submissions failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getStatus(req, res) {
    try {
        const { submissionIds } = req.query;
        const format = submissionIds.split(',');
        const timestamp = new Date().getTime().toString(16);
        const random = Math.random().toString(16).substr(2, 8);
        const id = timestamp + random;
        const newClient = new Client(id, format, res);
        const server = SseServer.getInstance();
        server.establishConnection(newClient);
    }
    catch (e) {
        console.log("Get submission status failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    create,
    getById,
    getSubmissions,
    getStatus
}