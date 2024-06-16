const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const ROLE = require("../enum/role");
const UserService = require("../services/user.service");
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signUp(req, res) {
    const { username, password, confirmPassword, email } = req.body;
    try {
        if (!email || !password || !username || !confirmPassword) {
            return new ErrorHandler(
                ERROR.MISSING_USER_INFO.status,
                ERROR.MISSING_USER_INFO.message
            ).httpResponse(res).httpResponse(res);
        }
        if (password.trim() !== confirmPassword.trim()) {
            return new ErrorHandler(
                ERROR.NOT_MATCH_PASSWORD.status,
                ERROR.NOT_MATCH_PASSWORD.message
            ).httpResponse(res);
        }

        const filter = {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
        const existedUser = await UserService.getUserByFilter(filter);
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
        console.log("User sign up failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function logIn(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return new ErrorHandler(
                ERROR.MISSING_USER_INFO.status,
                ERROR.MISSING_USER_INFO.message
            ).httpResponse(res);
        }
        const filter = {
            email: email
        }
        const user = await UserService.getUserByFilter(filter);
        if (!user) {
            return new ErrorHandler(
                ERROR.INCORRECT_EMAIL_OR_PASSWORD.status,
                ERROR.INCORRECT_EMAIL_OR_PASSWORD.message
            ).httpResponse(res);
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return new ErrorHandler(
                ERROR.INCORRECT_EMAIL_OR_PASSWORD.status,
                ERROR.INCORRECT_EMAIL_OR_PASSWORD.message
            ).httpResponse(res);
        }

        const accessToken = jwt.sign(
            {
                email: user.email,
                id: user.id,
                role: user.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: 86400,
            }
        );

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            maxAge: 86400
        });

        res.status(200).send({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            accessToken: accessToken
        })
    }
    catch (e) {
        console.log("User log in failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function addUser(req, res) {
    const { username, password, confirmPassword, email } = req.body;
    try {
        if (!email || !password || !username || !confirmPassword) {
            return new ErrorHandler(
                ERROR.MISSING_USER_INFO.status,
                ERROR.MISSING_USER_INFO.message
            ).httpResponse(res).httpResponse(res);
        }
        if (password.trim() !== confirmPassword.trim()) {
            return new ErrorHandler(
                ERROR.NOT_MATCH_PASSWORD.status,
                ERROR.NOT_MATCH_PASSWORD.message
            ).httpResponse(res);
        }

        const filter = {
            [Op.or]: [
                { username: username },
                { email: email }
            ]
        }
        const existedUser = await UserService.getUserByFilter(filter);
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
        console.log("Add user failed with error: ", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function removeUser(req, res) {
    try {
        const { id } = req.params;
        const user = await UserService.getById(id);
        if (!user) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_USER.status,
                ERROR.NON_EXISTED_USER.message
            ).httpResponse(res);
        }
        await UserService.remove(user);
        return res.status(200).send({ message: "Remove user successfully!" });
    }
    catch (e) {
        console.log("Remove user failed with error: ", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await UserService.getById(id);
        if (!user) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_USER.status,
                ERROR.NON_EXISTED_USER.message
            ).httpResponse(res);
        }
        res.status(200).send({
            id,
            username: user.username,
            email: user.email,
        })
    }
    catch (e) {
        console.log("Get user by id failed with error: ", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function getUsers(req, res) {
    try {
        const { ns } = req.query;
        const searchConditions = [];
        if (ns) searchConditions.push({ username: { [Op.like]: `%${ns}%` } });
        const filter = {
            [Op.or]: searchConditions
        }
        let users = await UserService.getUsersByFilter(filter);
        users = users.map((user) => {
            return (
                {
                    username: user.username,
                    email: user.email,

                })
        })
        res.status(200).send({
            users: users
        }
        )
    }
    catch (e) {
        console.log("Get users failed with error: ", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function validateToken(req, res) {
    const authorization = req.headers["authorization"];

    if (!authorization) {
        return new ErrorHandler(
            ERROR.INVALID_ACCESS_TOKEN.status,
            ERROR.INVALID_ACCESS_TOKEN.message
        ).httpResponse(res);
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
            clockTolerance: 5,
        });
        
        if (!decoded) {
            return new ErrorHandler(
                ERROR.INVALID_ACCESS_TOKEN.status,
                ERROR.INVALID_ACCESS_TOKEN.message
            ).httpResponse(res);
        }
        const user = await UserService.getById(decoded.id);

        if (!user) {
            return new ErrorHandler(
                ERROR.INVALID_ACCESS_TOKEN.status,
                ERROR.INVALID_ACCESS_TOKEN.message
            ).httpResponse(res);
        }

        res.status(200).send(
            {
                id: user.id,
                role: user.role
            })

    } catch (e) {
        console.log("User authenticate failed", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    signUp,
    logIn,
    addUser,
    removeUser,
    getUserById,
    getUsers,
    validateToken
}