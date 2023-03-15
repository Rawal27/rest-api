const express = require("express");
const logger = require("morgan");
const posts = require("./restApiApp/routes/post");
const users = require("./restApiApp/routes/user");
const bodyParser = require("body-parser");
const redis = require("redis");
const mongoose = require("./restApiApp/config/database");
var jwt = require("jsonwebtoken");
const app = express();

/** Setting secret key for jwt */
app.set("secretKey", "restApi");

/** This is a callback function that is called when the connection to the database is made. */
mongoose.connection.on('connected', function () {
  console.log(`Server Connected to Mongoose Successfully.`);
});

/** Mongoose connection error handling */
mongoose.connection.on(
  "error",
  console.error.bind(console, "Connection Error:")
);
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

/** Redis connection creation & Error handling */
(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(`Error connecting Redis Client: ${error}`));
  await redisClient.connect();
  console.log('Redis connected on Port 6379');
})();

/** Root Route */
app.get("/", function (req, res) {
  res.json({ Message: "Welcome to port 3000" });
});

/** Users route for authentication & authorization */
app.use("/users", users);

/** Middleware function to access /posts routes */
const validateUser = (req, res, next) => {
  jwt.verify(
    req.headers["x-access-token"],
    req.app.get("secretKey"),
    (error, decoded) => {
      if (error) {
        res.json({ status: "error", message: error.message, data: {} });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    }
  );
};

/** Posts route for CRUD application */
app.use("/posts", validateUser, posts);

app.use(function (req, res, next) {
  const error = new Error("Data Not Found");
  error.status = 404;
  next(error);
});

/** Error handling for status code 404 */
app.use(function (error, req, res, next) {
  if (error.status === 404) {
    res.status(404).json({ message: "Data Not found.", error: error });
  } else {
    res.status(500).json({ message: "Error Message", error: error });
  }
  console.log('Error :', error);
});

/** Port for listening server requests */
app.listen(3000, function () {
  console.log("Server listening on port 3000");
});
