const ERROR = {
    DEFAULT_SERVER_ERROR: {
        status: 500,
        message: "Internal server error"
    },
    INVALID_DATE: {
        status: 400,
        message: "Invalid date"
    },
    MISSING_CONTEST_INFO: {
        status: 400,
        message: "Missing user info"
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
    NON_EXISTED_USER: {
        status: 404,
        message: "User is not existed"
    },
    INCORRECT: {
        status: 401,
        message: "Incorrect email or password"
    }
}
module.exports = ERROR;