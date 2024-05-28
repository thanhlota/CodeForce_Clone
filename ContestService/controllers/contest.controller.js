const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ContestService = require("../services/contest.service");
const isValidatedDate = require("../utils/isValidatedDate");

async function create() {
    try {
        const { name, start_time, end_time } = req.body;
        if (!name || !start_time || !end_time) {
            return new ErrorHandler(ERROR.MISSING_USER_INFO.status, ERROR.MISSING_CONTEST_INFO.message);
        }
        if (!isValidatedDate(start_time) || !isValidatedDate(end_time)) {
            return new ErrorHandler(ERROR.INVALID_DATE.status, ERROR, ERROR.INVALID_DATE.message);
        }
        if (start_time >= end_time) {
            return new ErrorHandler(ERROR.INVALID_DATE.status, ERROR, ERROR.INVALID_DATE.message);
        }
        await ContestService.create(name, start_time, end_time);
        res.status(200).send({ message: 'Contest created successfully' })
    }
    catch (e) {
        console.log("Contest create failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }

}

async function remove() {
    try {
        
    }
    catch (e) {
        console.log("Contest remove failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function update() {
    try {

    }
    catch (e) {
        console.log("Contest update failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getContestById() {
    try {

    }
    catch (e) {
        console.log("Get contest by id failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getContests() {
    try {

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