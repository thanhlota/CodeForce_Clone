const { verifyAdmin } = require("../middlewares/auth.js");
const UserController = require("../controllers/user.controller.js");
const express = require('express');
const UserRouter = express.Router();

UserRouter.post(
    "/signup", UserController.signUp
);
UserRouter.post(
    "/login",
    UserController.logIn
);
UserRouter.post(
    "/admin/add-user",
    verifyAdmin,
    UserController.addUser
);
UserRouter.delete(
    "/admin/remove-user/:id",
    verifyAdmin,
    UserController.removeUser
);
UserRouter.get(
    "/all",
    UserController.getUsers
)

UserRouter.get(
    "/:id",
    UserController.getUserById
);

module.exports = UserRouter;