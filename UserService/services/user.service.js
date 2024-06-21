const users = require("../models").users;
const bcrypt = require("bcryptjs");

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

async function getUsersByFilter(filter) {
    return await users.findAll({
        where: filter,
    });
}

async function getUserByFilter(filter) {
    return await users.findOne({
        where: filter,
    });
}

async function remove(user) {
    return await user.destroy();
}

async function update(user, updateFields = {}) {
    for (let [key, value] of Object.entries(updateFields)) {
        user[key] = value;
    }
    return await user.save();
}

module.exports = {
    createOne,
    getById,
    getUserByFilter,
    getUsersByFilter,
    remove,
    update
}