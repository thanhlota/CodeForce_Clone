const TestCaseController = require("../controllers/testcase.controller.js");
const express = require('express');
const TestCaseRouter = express.Router();
const { verifyAdmin } = require("../middlewares/auth.js");

TestCaseRouter.post(
    "/admin/create", verifyAdmin, TestCaseController.create
);

// TestCaseRouter.delete(
//     "/admin/remove/:id", TestCaseController.remove
// )

// TestCaseRouter.put(
//     "/admin/update/:id", TestCaseController.update
// )

TestCaseRouter.get(
    "/all", TestCaseController.getTestcases
)


module.exports = TestCaseRouter;
