const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ContestService = require("../services/contest.service");
const ProblemService = require("../services/problem.service");
const CategoryService = require("../services/category.service");
const { Op } = require("sequelize");
const { sequelize } = require("../models");

async function create(req, res) {
    const t = await sequelize.transaction();
    try {
        const { contest_id, title, description, guide_input, guide_output, time_limit, memory_limit, categories } = req.body;
        if (!contest_id || !title || !description || !guide_input || !guide_output | !time_limit || !memory_limit || !categories || !categories.length) {
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

        const searchConditions = [];
        searchConditions.push({
            type: {
                [Op.in]: categories
            }
        });
        const filter = {
            [Op.and]: searchConditions
        }
        const db_categories = await CategoryService.getCategories(filter);
        const compare_db_categories = db_categories.map((item) => item.dataValues.type);
        const invalid_categories = [];
        for (let i = 0; i < categories.length; i++) {
            if (!compare_db_categories.includes(categories[i])) invalid_categories.push(categories[i]);
        }
        if (invalid_categories.length) {
            let message = "Categories(category): ";
            invalid_categories.forEach((item) => {
                message += item + " ";
            })
            message += "are(is) invalid";
            return new ErrorHandler(
                ERROR.NON_EXISTED_CATEGORIES.status,
                message
            ).httpResponse(res);
        }

        const problem = await ProblemService.create(contest_id, title, description, guide_input, guide_output, time_limit, memory_limit,
            { transaction: t }
        );
        await problem.addCategory(db_categories, { transaction: t });
        await t.commit();
        res.status(200).send({
            problem
        })
    }
    catch (e) {
        await t.rollback();
        console.log("Problem create failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }

}

// async function remove(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         const contest = await ContestService.getById(id);
//         if (!contest) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         await ContestService.remove(contest);
//         res.status(200).send({
//             message: "Contest removed successfully!"
//         })
//     }
//     catch (e) {
//         console.log("Contest remove failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function update(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         const contest = await ContestService.getById(id);
//         if (!contest) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         const { name, start_time, end_time } = req.body;
//         if (!name || !start_time || !end_time) {
//             return new ErrorHandler(
//                 ERROR.MISSING_UPDATE_FIELD.status,
//                 ERROR.MISSING_UPDATE_FIELD.message
//             )
//                 .httpResponse(res)
//         }

//         if (!isValidatedDate(start_time) || !isValidatedDate(end_time)) {
//             return new ErrorHandler(
//                 ERROR.INVALID_DATE.status,
//                 ERROR.INVALID_DATE.message
//             ).httpResponse(res);
//         }

//         if (start_time >= end_time) {
//             return new ErrorHandler(
//                 ERROR.INVALID_DATE.status,
//                 ERROR.INVALID_DATE.message
//             ).httpResponse(res);
//         }

//         const newContest = await ContestService.update(contest, {
//             name,
//             start_time,
//             end_time
//         })
//         res.status(200).send({
//             contest: newContest
//         })
//     }
//     catch (e) {
//         console.log("Contest update failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function getContestById(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         const contest = await ContestService.getById(id);
//         if (!contest) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CONTEST.status,
//                 ERROR.NON_EXISTED_CONTEST.message
//             ).httpResponse(res);
//         }
//         res.status(200).send({
//             contest
//         })
//     }
//     catch (e) {
//         console.log("Get contest by id failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function getContests(req, res) {
//     try {
//         const { ns } = req.query;
//         const searchConditions = [];
//         if (ns) searchConditions.push({ name: { [Op.like]: `%${ns}%` } });
//         const filter = {
//             [Op.and]: searchConditions
//         }
//         const contests = await ContestService.getContests(filter);
//         const now = Date.now();
//         const ongoingContests = [];
//         const upcomingContests = [];
//         const pastContests = [];
//         contests.forEach(contest => {
//             if (contest.start_time <= now && contest.end_time >= now) {
//                 ongoingContests.push(contest);
//             } else if (contest.start_time > now) {
//                 upcomingContests.push(contest);
//             } else if (contest.end_time < now) {
//                 pastContests.push(contest);
//             }
//         });
//         return res.status(200).send({
//             contests: {
//                 ongoingContests,
//                 upcomingContests,
//                 pastContests
//             }
//         })
//     }
//     catch (e) {
//         console.log("Get contests failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

module.exports = {
    create,
    // remove,
    // update,
    // getContestById,
    // getContests
}