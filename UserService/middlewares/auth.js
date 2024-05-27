const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/error");
const ERROR = require("../enum/error");
const ROLE = require("../enum/role");
const UserService = require("../services/user.service")
let DefaultError = new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message);

async function verifyAdmin(req, res, next) {
    const authorization = req.headers["authorization"];

    if (!authorization) {
        throw new ErrorHandler(404, "Missing access token");
    }
    const token = authorization.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            clockTolerance: 5,
        });

        const user = await UserService.getById(decoded.id);

        if (!user) {
            return new ErrorHandler(
                ERROR.INVALID_ACCESS_TOKEN.status,
                ERROR.INVALID_ACCESS_TOKEN.message
            ).httpResponse(res);
        }

        if (user.role !== ROLE.ADMIN) {
            return new ErrorHandler(
                ERROR.AUTHORIZE_FAILED.status,
                ERROR.AUTHORIZE_FAILED.message
            ).httpResponse(res);
        }
        next();
    } catch (e) {
        console.log("User authenticate failed", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    verifyAdmin
}