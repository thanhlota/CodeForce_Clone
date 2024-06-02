const results = require("../models").results;

async function getResults(filter = {}) {
    return await results.findAll({
        where: filter,
    });
}

module.exports = {
    getResults
}