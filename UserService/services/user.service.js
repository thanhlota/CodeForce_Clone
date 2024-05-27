const users = require("../models").users;
const bcrypt = require("bcrypt");
const ErrorHandler = require("../utils/error")

async function createOne(email, username, role, password) {
    const user = users.build({
        email,
        username,
        role,
    })
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    return await user.save();
}

async function getById(id) {
    return await users.findByPk(id);
}

async function getByFilter(filter) {
    return await users.findOne({
        where: filter,
    });
}

async function remove(id) {
    const user = await users.findByPk(id);
    if (!user) {
        throw new ErrorHandler(404, "User is non-existent");
    }
    return await user.destroy();
}


module.exports = {
    createOne,
    getById,
    getByFilter,
    remove
}