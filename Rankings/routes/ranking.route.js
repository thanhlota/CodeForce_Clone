
const RankingController = require("../controllers/ranking.controller.js");
const express = require('express');
const RankingRouter = express.Router();

RankingRouter.post("/update-ranking", RankingController.updateRanking);

RankingRouter.post("/sync", RankingController.sync);

RankingRouter.get("/:contest_id", RankingController.getRankingByContest);



module.exports = RankingRouter;