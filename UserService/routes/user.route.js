const { verifyAdmin } = require("../middlewares/auth.js");
const UserController = require("../controllers/user.controller.js");
const express = require('express');
const UserRouter = express.Router();

UserRouter.get(
    "/validateToken", UserController.validateToken
)

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

UserRouter.put(
    "/admin/update-user",
    verifyAdmin,
    UserController.updateUser
);

UserRouter.delete(
    "/admin/remove-user/:id",
    verifyAdmin,
    UserController.removeUser
);

UserRouter.get(
    "/all",
    verifyAdmin,
    UserController.getUsers
)

UserRouter.get(
    "/:id",
    UserController.getUserById
);


module.exports = UserRouter;