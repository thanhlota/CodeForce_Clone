const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ROLE = require("../enum/role");

async function verifyUser(req, res, next) {
    try {
        let userInfo = req.headers['x-user-info'];

        if (!userInfo) {
            return new ErrorHandler(
                ERROR.INVALID_USER_INFO.status,
                ERROR.INVALID_USER_INFO.message
            ).httpResponse(res);
        }

        userInfo = JSON.parse(JSON.parse(userInfo));

        if (!userInfo.id || !userInfo.role) {
            return new ErrorHandler(
                ERROR.INVALID_USER_INFO.status,
                ERROR.INVALID_USER_INFO.message
            ).httpResponse(res);
        }

        const { user_id } = req.body;

        if (user_id != userInfo.id) {
            return new ErrorHandler(
                ERROR.MALFORMED_REQUEST.status,
                ERROR.MALFORMED_REQUEST.message
            ).httpResponse(res);
        }

        next()
    }
    catch (e) {
        console.log("Verify admin failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    verifyUser
}