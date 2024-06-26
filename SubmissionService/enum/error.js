const ERROR = {
    INVALID_USER_INFO: {
        status: 401,
        message: "Invalid user info"
    },

    FORBIDDEN_RESOURCE: {
        status: 403,
        message: "Forbidden resource"
    },

    MALFORMED_REQUEST: {
        status: 400,
        message: "Malformed request"
    },

    DEFAULT_SERVER_ERROR: {
        status: 500,
        message: "Internal server error"
    },

    MISSING_SUBMISSION_INFO: {
        status: 400,
        message: "Missing submission info"
    },

    AUTHORIZE_FAILED: {
        status: 403,
        message: "Forbidden"
    },

    NON_EXISTED_SUBMISSION: {
        status: 404,
        message: "Submission is not existed"
    },
}
module.exports = ERROR;