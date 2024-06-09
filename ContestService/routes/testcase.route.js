const TestCaseController = require("../controllers/testcase.controller.js");
const express = require('express');
const TestCaseRouter = express.Router();

// TestCaseRouter.post("/admin/file", TestCaseController.uploadFile);
TestCaseRouter.post(
    "/admin/create", TestCaseController.create
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
