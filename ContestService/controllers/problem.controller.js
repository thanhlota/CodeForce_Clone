const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ContestService = require("../services/contest.service");
const ProblemService = require("../services/problem.service");
const { Op } = require("sequelize");

async function create(req, res) {
    try {
        const { contest_id, title, description, guide_input, guide_ouput, time_limit, memory_limit, category, new_category } = req.body;
        if (!contest_id || !title || !description || !guide_input || !guide_ouput | !time_limit || !memory_limit || !category) {
            return new ErrorHandler(
                ERROR.MISSING_PROBLEM_INFO.status,
                ERROR.MISSING_PROBLEM_INFO.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(contest_id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const problem = await ProblemService.create(title, description, guide_input, guide_ouput, time_limit, memory_limit);
        res.status(200).send({
            problem
        })
    }
    catch (e) {
        console.log("Contest create failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }

}

async function remove(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        await ContestService.remove(contest);
        res.status(200).send({
            message: "Contest removed successfully!"
        })
    }
    catch (e) {
        console.log("Contest remove failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const { name, start_time, end_time } = req.body;
        if (!name || !start_time || !end_time) {
            return new ErrorHandler(
                ERROR.MISSING_UPDATE_FIELD.status,
                ERROR.MISSING_UPDATE_FIELD.message
            )
                .httpResponse(res)
        }

        if (!isValidatedDate(start_time) || !isValidatedDate(end_time)) {
            return new ErrorHandler(
                ERROR.INVALID_DATE.status,
                ERROR.INVALID_DATE.message
            ).httpResponse(res);
        }

        if (start_time >= end_time) {
            return new ErrorHandler(
                ERROR.INVALID_DATE.status,
                ERROR.INVALID_DATE.message
            ).httpResponse(res);
        }

        const newContest = await ContestService.update(contest, {
            name,
            start_time,
            end_time
        })
        res.status(200).send({
            contest: newContest
        })
    }
    catch (e) {
        console.log("Contest update failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getContestById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        res.status(200).send({
            contest
        })
    }
    catch (e) {
        console.log("Get contest by id failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getContests(req, res) {
    try {
        const { ns } = req.query;
        const searchConditions = [];
        if (ns) searchConditions.push({ name: { [Op.like]: `%${ns}%` } });
        const filter = {
            [Op.and]: searchConditions
        }
        const contests = await ContestService.getContests(filter);
        const now = Date.now();
        const ongoingContests = [];
        const upcomingContests = [];
        const pastContests = [];
        contests.forEach(contest => {
            if (contest.start_time <= now && contest.end_time >= now) {
                ongoingContests.push(contest);
            } else if (contest.start_time > now) {
                upcomingContests.push(contest);
            } else if (contest.end_time < now) {
                pastContests.push(contest);
            }
        });
        return res.status(200).send({
            contests: {
                ongoingContests,
                upcomingContests,
                pastContests
            }
        })
    }
    catch (e) {
        console.log("Get contests failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    create,
    remove,
    update,
    getContestById,
    getContests
}