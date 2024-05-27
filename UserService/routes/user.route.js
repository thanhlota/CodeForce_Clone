const { verifyAdmin } = require("../middlewares/auth.js");
const UserController = require("../controllers/user.controller.js");
const express = require('express');
const UserRouter = express.Router();

UserRouter.post(
    "/signup", UserController.signUp
);
UserRouter.post(
    "/logIn",
    UserController.logIn
);
UserRouter.post(
    "/admin/addUser",
    verifyAdmin,
    UserController.addUser
);
UserRouter.delete(
    "/admin/removeUser",
    verifyAdmin,
    UserController.removeUser
);
UserRouter.get(
    "/:id",
    UserController.getUserById
);
UserRouter.get(
    "/all",
    UserController.getUsers
)

module.exports = UserRouter;