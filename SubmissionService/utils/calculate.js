const { submissions, results } = require('../models');
const { Op, fn, col } = require('sequelize');


async function calculateAverageRunTime() {
    const _results = await results.findAll({
        attributes: [
            'submission_id',
            [fn('MAX', col('createdAt')), 'latestResultTime']
        ],
        group: ['submission_id']
    });
``
    const latestResultTimes = {};

    _results.forEach(result => {
        latestResultTimes[result.submission_id] = result.get('latestResultTime');
    });

    // Get all submissions with their corresponding latestResultTime
    const _submissions = await submissions.findAll({
        where: {
            id: {
                [Op.in]: Object.keys(latestResultTimes)
            }
        }
    });

    // Calculate total run time for each language
    const runTimes = {};
    const counts = {};
    _submissions.forEach(submission => {
        const language = submission.language;
        const submissionTime = new Date(submission.createdAt);
        const resultTime = new Date(latestResultTimes[submission.id]);
        const runTime = (resultTime - submissionTime) / 1000; // Time in seconds

        if (!runTimes[language]) {
            runTimes[language] = 0;
            counts[language] = 0;
        }

        runTimes[language] += runTime;
        counts[language] += 1;
    });

    // Calculate average run time for each language
    const averageRunTimes = {};
    for (const language in runTimes) {
        averageRunTimes[language] = runTimes[language] / counts[language];
    }

    return averageRunTimes;
}

calculateAverageRunTime().then(averageRunTimes => {
    console.log('Average Run Times:', averageRunTimes);
}).catch(error => {
    console.error('Error calculating average run times:', error);
});