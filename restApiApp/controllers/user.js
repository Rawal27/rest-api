const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/** Creates a new user by entering name email and password in request */
const createUser = async (req, res, next) => {
  try {
    const {
      body: { name, email, password },
    } = req;
    const user = await new userModel({
      name: name,
      email: email,
      password: password,
    });
    const savedUser = await user.save();
    res.send({
      code: 201,
      message: "User Registered Successfully!",
      data: savedUser.email,
    });
  } catch (error) {
    console.log(error);
    res.send({
      error,
    });
  }
};

/** Authenticates the user by entering email and password hence returns the JWT token */
const authenticateUser = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;
    const user = await userModel.findOne({ email });
    if (user!= null && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user._id }, req.app.get("secretKey"), {
        expiresIn: "1h",
      });
      res.send({
        message: "User Found Successfully.",
        data: { user: user, token: token },
      });
    } else {
      res.send({
        message: "Invalid Credentials.",
        data: { email, password },
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  authenticateUser,
};
