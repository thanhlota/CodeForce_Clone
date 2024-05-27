const ErrorHandler = require("../utils/error");
const ERROR = require("../enum/error");
const ROLE = require("../enum/role");
const UserService = require("../services/user.service");
let DefaultError = new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message);

async function signUp(req, res) {
    const { username, password, confirmPassword, email } = req.body;
    try {
        if (!email || !password || !username || !confirmPassword) {
            return new ErrorHandler(
                ERROR.MISSING_USER_INFO.status,
                ERROR.MISSING_USER_INFO.message
            ).httpResponse(res);
        }
        if (password.trim() !== confirmPassword.trim()) {
            return new ErrorHandler(
                ERROR.NOT_MATCH_PASSWORD.status,
                ERROR.NOT_MATCH_PASSWORD.message
            ).httpResponse(res);
        }

        const filter = {
            [Op.or]: [
                { username },
                { email }
            ]
        }
        const existedUser = await UserService.getByFilter(filter);
        if (existedUser) {
            if (existedUser.username == username) {
                return new ErrorHandler(
                    ERROR.USERNAME_EXISTED.status,
                    ERROR.USERNAME_EXISTED.message
                ).httpResponse(res);
            }
            if (existedUser.email == email) {
                return new ErrorHandler(
                    ERROR.EMAIL_EXISTED.status,
                    ERROR.EMAIL_EXISTED.message
                ).httpResponse(res);
            }
        }
        await UserService.createOne(email, username, ROLE.USER, password);
        return res.status(200).send({ message: 'User register successfull!' });
    }
    catch (e) {
        console.log("User sign up failed", e.message);
        return DefaultError.httpResponse(res);
    }
}

function logIn(req, res) {
    try {
        const { username, password } = req.body;
    }
    catch (e) {
        console.log("User sign up failed", e.message);
        new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message).httpResponse(res);
    }
}

function addUser(req, res) {
    try {

    }
    catch (e) {
        console.log("User sign up failed", e.message);
        new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message).httpResponse(res);
    }
}

function removeUser(req, res) {
    try {

    }
    catch (e) {
        console.log("User sign up failed", e.message);
        new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message).httpResponse(res);
    }
}

function getUserById(req, res) {
    try {

    }
    catch (e) {
        console.log("User sign up failed", e.message);
        new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message).httpResponse(res);
    }
}

function getUsers(req, res) {
    try {

    }
    catch (e) {
        console.log("User sign up failed", e.message);
        new ErrorHandler(ERROR.DEFAULT_SERVER_ERROR.status, ERROR.DEFAULT_SERVER_ERROR.message).httpResponse(res);
    }
}

module.exports = {
    signUp,
    logIn,
    addUser,
    removeUser,
    getUserById,
    getUsers
}