const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.post("/register-user", userController.createUser); // Creates a new user
router.post(
  "/authenticate-user",
  userController.authenticateUser
); // Authenticates the created user by generating JWT token

module.exports = router;
