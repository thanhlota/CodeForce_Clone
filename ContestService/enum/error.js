const ERROR = {
    INVALID_USER_INFO: {
        status: 401,
        message: "Invalid user info"
    },
    FORBIDDEN_RESOURCE: {
        status: 403,
        message: "Forbidden resource"
    },
    DEFAULT_SERVER_ERROR: {
        status: 500,
        message: "Internal server error"
    },
    INVALID_DATE: {
        status: 400,
        message: "Invalid date"
    },
    MISSING_UPDATE_FIELD: {
        status: 400,
        message: "Missing update field"
    },
    MISSING_CONTEST_INFO: {
        status: 400,
        message: "Missing contest info"
    },
    MISSING_PROBLEM_INFO: {
        status: 400,
        message: "Missing problem info"
    },
    MISSING_TESTCASE_INFO: {
        status: 400,
        message: "Missing testcase info"
    },
    EMAIL_EXISTED: {
        status: 409,
        message: "Email already existed"
    },
    USERNAME_EXISTED: {
        status: 409,
        message: "Username already existed"
    },
    AUTHORIZE_FAILED: {
        status: 403,
        message: "Forbidden"
    },
    NON_EXISTED_CONTEST: {
        status: 404,
        message: "Contest is not existed"
    },
    NON_EXISTED_CATEGORIES: {
        status: 404,
        message: "Category is not existed"
    },
    NON_EXISTED_PROBLEM: {
        status: 404,
        message: "Problem is not existed"
    },
    INCORRECT: {
        status: 401,
        message: "Incorrect email or password"
    }
}
module.exports = ERROR;