const SubmissionController = require("../controllers/submission.controller.js");
const express = require('express');
const SubmissionRouter = express.Router();
const { verifyUser } = require("../middlewares/auth.js");

SubmissionRouter.post("/submit", verifyUser, SubmissionController.create);
SubmissionRouter.get("/all", SubmissionController.getSubmissions);
SubmissionRouter.get("/status", SubmissionController.getStatus)
SubmissionRouter.get("/:id",  SubmissionController.getById);

module.exports = SubmissionRouter;