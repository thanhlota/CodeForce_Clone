const rankings = require("../models").rankings;
const Redis = require("../redisClient");
const PAGE_LIMIT = 20;
async function create(user_id, contest_id, user_score) {
    const ranking = rankings.build({
        user_id,
        contest_id,
        user_score
    })
    return await ranking.save();
}

async function getRanking(filter = {}) {
    return await rankings.findOne({
        where: filter,
    });
}

async function getRedisRanking(filter = {}) {
    try {
        const client = Redis.getInstance().getClient();
        const { page, user_name, contest_id } = filter;
        const start = (page - 1) * PAGE_LIMIT;
        const end = start + PAGE_LIMIT - 1;
        let userScores = [];
        if (!user_name) {
            const users = await client.sendCommand(['ZREVRANGE', `contest:${contest_id}_scores`, start.toString(), end.toString(), 'WITHSCORES']);
            for (let i = 0; i < users.length; i += 2) {
                const userContestKey = `${users[i]}_contest:${contest_id}`;
                const keys = await client.hGetAll(userContestKey);
                let userName = null;
                let problems = [];
                for (const [key, value] of Object.entries(keys)) {
                    if (key == 'user_name') {
                        userName = value;
                    }
                    else {
                        const id = key.split(':')[1];
                        problems.push({
                            id: id,
                            verdict: value
                        })
                    }
                }
                problems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                userScores.push({
                    id: users[i].split(':')[1],
                    userName,
                    problems,
                    score: users[i + 1]
                })
            }
        }
        else {
            const users = await client.sendCommand(['ZREVRANGE', `contest:${contest_id}_scores`, '0', '-1', 'WITHSCORES']);
            for (let i = 0; i < users.length; i += 2) {
                const userContestKey = `${users[i]}_contest:${contest_id}`;
                const keys = await client.hGetAll(userContestKey);
                let userName = null;
                let problems = [];
                let isValidUser = true;
                for (const [key, value] of Object.entries(keys)) {
                    if (key == 'user_name') {
                        if (value.toLowerCase().includes(user_name.toLowerCase())) {
                            userName = value;
                        }
                        else {
                            isValidUser = false;
                            break;
                        }
                    }
                    else {
                        const id = key.split(':')[1];
                        problems.push({
                            id: id,
                            verdict: value
                        })
                    }
                }
                if (isValidUser) {
                    problems.sort((a, b) => parseInt(a.id) - parseInt(b.id));
                    userScores.push({
                        id: users[i].split(':')[1],
                        userName,
                        problems,
                        score: users[i + 1]
                    })
                }
            }
        }
        userScores = userScores.slice(start, end + 1);
        return userScores;
    }
    catch (e) {
        throw (e);
    }

}

async function updateRedisRanking(userId, userName, contestId, problemId, verdict) {
    try {
        const client = Redis.getInstance().getClient();
        const userContestKey = `user:${userId}_contest:${contestId}`

        const existingUserName = await client.hGet(userContestKey, 'user_name');
        if (!existingUserName) {
            await client.hSet(userContestKey, 'user_name', userName);
        }

        const problemKey = `problem:${problemId}`;
        const existingVerdict = await client.hGet(userContestKey, problemKey);

        if (!existingVerdict || (existingVerdict !== 'pass')) {
            await client.hSet(userContestKey, problemKey, verdict);
            const score = verdict === 'pass' ? 10 : 0;
            const existingScore = await client.zScore(`contest:${contestId}_scores`, `user:${userId}`);
            if (existingScore !== null) {
                await client.zAdd(`contest:${contestId}_scores`, { score: existingScore + score, value: `user:${userId}` });
            } else {
                await client.zAdd(`contest:${contestId}_scores`, { score, value: `user:${userId}` });
            }
        }
    }
    catch (e) {
        throw (e);
    }
}

module.exports = {
    create,
    getRanking,
    getRedisRanking,
    updateRedisRanking
}