const categories = require("../models").categories;

async function getCategories(filter) {
    return await categories.findAll({
        where: filter,
    });
}

module.exports = {
    getCategories
}