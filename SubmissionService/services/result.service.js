const results = require("../models").results;

async function getResults(filter = {}) {
    return await results.findAll({
        where: filter,
    });
}

async function createResults(new_results) {
    return await results.bulkCreate(new_results);
}

module.exports = {
    getResults,
    createResults
}