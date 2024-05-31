const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ProblemService = require("../services/problem.service");
const TestCaseService = require("../services/testcase.service");
async function create(req, res) {
    try {
        const { problem_id, input, expected_output, isSample } = req.body;
        if (!problem_id || !input || !expected_output || !isSample) {
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

// async function remove(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         const problem = await ProblemService.getById(id);
//         if (!problem) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         await ProblemService.remove(problem);
//         res.status(200).send({
//             message: "Problem removed successfully!"
//         })
//     }
//     catch (e) {
//         console.log("Problem remove failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function update(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         const problem = await ProblemService.getById(id);
//         if (!problem) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         const { title, description, guide_input, guide_expected_output, time_limit, memory_limit, categories } = req.body;
//         if (!title || !description || !guide_input || !guide_expected_output || !time_limit || !memory_limit || !categories) {
//             return new ErrorHandler(
//                 ERROR.MISSING_PROBLEM_INFO.status,
//                 ERROR.MISSING_PROBLEM_INFO.message
//             ).httpResponse(res)
//         }

//         const searchConditions = [];
//         searchConditions.push({
//             type: {
//                 [Op.in]: categories
//             }
//         });
//         const filter = {
//             [Op.and]: searchConditions
//         }
//         const db_categories = await CategoryService.getCategories(filter);
//         const compare_db_categories = db_categories.map((item) => item.dataValues.type);
//         const invalid_categories = [];
//         for (let i = 0; i < categories.length; i++) {
//             if (!compare_db_categories.includes(categories[i])) invalid_categories.push(categories[i]);
//         }
//         if (invalid_categories.length) {
//             let message = "Categories(category): ";
//             invalid_categories.forEach((item) => {
//                 message += item + " ";
//             })
//             message += "are(is) invalid";
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_CATEGORIES.status,
//                 message
//             ).httpResponse(res);
//         }
//         const newProblem = await ProblemService.update(problem, {
//             title, description, guide_input, guide_expected_output, time_limit, memory_limit, categories
//         })
//         await problem.setCategories(db_categories);
//         return res.status(200).send({
//             problem: newProblem
//         })
//     }
//     catch (e) {
//         console.log("Problem update failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function getProblemById(req, res) {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         const problem = await ProblemService.getById(id);
//         if (!problem) {
//             return new ErrorHandler(
//                 ERROR.NON_EXISTED_PROBLEM.status,
//                 ERROR.NON_EXISTED_PROBLEM.message
//             ).httpResponse(res);
//         }
//         res.status(200).send({
//             problem
//         })
//     }
//     catch (e) {
//         console.log("Get contest by id failed with error:", e.message);
//         return DefaultError.httpResponse(res);
//     }
// }

// async function getProblems(req, res) {
//     try {
//         const { ns, cgs } = req.query;
//         const searchConditions = [];
//         if (ns) searchConditions.push({ name: { [Op.like]: `%${ns}%` } });
//         const filter = {
//             [Op.and]: searchConditions
//         }
//         const problems = await ProblemService.getProblems(filter);

//         return res.status(200).send({
//             problems
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
    // getProblemById,
    // getProblems
}