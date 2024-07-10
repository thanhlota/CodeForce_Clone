const RankingService = require("../models").rankings;
const SubmissionService = require("../models").submissions;
const Redis = require("../redisClient");
const _Ranking = require("../services/ranking.service");

const sequelize = require('../models').sequelize;

async function syncRedis(contestId) {
    
    const scores = await _Ranking.getRedisRanking({ contest_id: contestId });
    console.log('scores', scores);
    const transaction = await sequelize.transaction();

    try {
        for (const score of scores) {
            await RankingService.create({
                contest_id: contestId,
                user_id: score.id,
                user_name: score.userName,
                user_score: parseFloat(score.score),
            }, { transaction });

            for (const problem of score.problems) {
                await SubmissionService.create({
                    user_id: score.id,
                    contest_id: contestId,
                    problem_id: problem.id,
                    verdict: problem.verdict,
                }, { transaction });
            }
        }
        await transaction.commit();
        // Remove data from Redis
        const client = Redis.getInstance().getClient();
        await client.del(`contest:${contestId}_scores`);
        const keys = await client.keys(`user:*_contest:${contestId}`);
        for (const key of keys) {
            await client.del(key);
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }

}

module.exports = {
    syncRedis
}
