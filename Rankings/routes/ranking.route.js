
const RankingController = require("../controllers/ranking.controller.js");
const express = require('express');
const RankingRouter = express.Router();

RankingRouter.get("/:contest_id", RankingController.getRankingByContest);

RankingRouter.post("/update-ranking", RankingController.updateRanking);

module.exports = RankingRouter;