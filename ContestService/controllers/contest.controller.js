const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ContestService = require("../services/contest.service");
const isValidatedDate = require("../utils/isValidatedDate");
const { Op } = require("sequelize");

async function create(req, res) {
    try {
        const { name, start_time, end_time } = req.body;
        if (!name || !start_time || !end_time) {
            return new ErrorHandler(
                ERROR.MISSING_CONTEST_INFO.status,
                ERROR.MISSING_CONTEST_INFO.message
            ).httpResponse(res);
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
        const contest = await ContestService.create(name, start_time, end_time);
        res.status(200).send({
            contest
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

async function registerContest(req, res) {
    try {
        const { user_id, user_name, contest_id } = req.body;
        if (!user_id || !user_name) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_USER.status,
                ERROR.NON_EXISTED_USER.message
            ).httpResponse(res);
        }
        if (!contest_id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(contest_id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contestant = await ContestService.register(contest_id, user_id, user_name)
        return res.status(200).send({
            contestant
        })
    }
    catch (e) {
        console.log("Register contest failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function unregisterContest(req, res) {
    try {
        const { user_id, contest_id } = req.body;
        if (!user_id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_USER.status,
                ERROR.NON_EXISTED_USER.message
            ).httpResponse(res);
        }
        if (!contest_id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        const contest = await ContestService.getById(contest_id);
        if (!contest) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_CONTEST.status,
                ERROR.NON_EXISTED_CONTEST.message
            ).httpResponse(res);
        }
        await ContestService.unregister(contest_id, user_id)
        return res.status(200).send({
            message: "Unregister successfully!"
        })
    }
    catch (e) {
        console.log("Unregister contest failed with error:", e.message);
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
        return res.status(200).send({
            contests
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
    getContests,
    registerContest,
    unregisterContest
}