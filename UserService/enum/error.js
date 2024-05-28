const ERROR = {
    DEFAULT_SERVER_ERROR: {
        status: 500,
        message: "Internal server error"
    },
    MISSING_USER_INFO: {
        status: 400,
        message: "Missing user info"
    },
    NOT_MATCH_PASSWORD: {
        status: 400,
        message: "Password and confirm password dont match"
    },
    EMAIL_EXISTED: {
        status: 409,
        message: "Email already existed"
    },
    USERNAME_EXISTED: {
        status: 409,
        message: "Username already existed"
    },
    INVALID_ACCESS_TOKEN: {
        status: 401,
        message: "Invaid access token"
    },
    AUTHORIZE_FAILED: {
        status: 403,
        message: "Forbidden"
    },
    NON_EXISTED_USER: {
        status: 404,
        message: "User is not existed"
    },
    INCORRECT_EMAIL_OR_PASSWORD: {
        status: 401,
        message: "Incorrect email or password"
    }

}
module.exports = ERROR;