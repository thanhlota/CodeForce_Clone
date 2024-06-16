const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ROLE = require("../enum/role");

async function verifyAdmin(req, res, next) {
    try {
        const userInfo = req.headers['x-user-info'];

        if (!userInfo || !userInfo.id || !userInfo.role) {
            return new ErrorHandler(
                ERROR.INVALID_USER_INFO.status,
                ERROR.INVALID_USER_INFO.message
            ).httpResponse(res);
        }

        if (userInfo.role != ROLE.ADMIN) {
            return new ErrorHandler(
                ERROR.FORBIDDEN_RESOURCE.status,
                ERROR.FORBIDDEN_RESOURCE.message
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
    verifyAdmin
}