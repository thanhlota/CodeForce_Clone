const { ErrorHandler, DefaultError } = require("../utils/error");
const ERROR = require("../enum/error");
const RankingService = require("../services/ranking.service");
const SyncService = require("../services/sync.service");
async function getRankingByContest(req, res) {
    try {
        const { contest_id } = req.params;
        if (!contest_id) {
            return new ErrorHandler(
                ERROR.NON_EXISTED_RANKING.status,
                ERROR.NON_EXISTED_RANKING.message
            ).httpResponse(res);
        }

        let { page, user_name } = req.query;

        const userScores = await RankingService.getRanking({ page, user_name, contest_id });
        return res.status(200).send({
            scores: userScores
        })

    }
    catch (e) {
        console.log("Get ranking failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function updateRanking(req, res) {
    try {
        const { userId, userName, contestId, problemId, verdict } = req.body;
        if (!userId || !userName || !contestId || !problemId || !verdict) {
            return new ErrorHandler(
                ERROR.MISSING_RANKING_INFO.status,
                ERROR.MISSING_RANKING_INFO.message
            ).httpResponse(res);
        }
        await RankingService.updateRedisRanking(userId, userName, contestId, problemId, verdict);
        return res.status(200).send({
            message: "OK"
        })
    }
    catch (e) {
        console.log("Update ranking failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

async function sync(req, res) {
    const { contestId } = req.body;
    try {
        await SyncService.syncRedis(contestId);
        return res.status(200).send({
            message: "OK"
        })
    }
    catch (e) {
        console.log("Sync ranking failed with error:", e.message);
        return DefaultError.httpResponse(res);
    }
}

module.exports = {
    getRankingByContest,
    updateRanking,
    sync
}
