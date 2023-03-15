const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const salt = 10;

/* User Schema Defination */
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

/* Moongoose pre-hook to manipulate data before saving it into the database. */
UserSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});
module.exports = mongoose.model("User", UserSchema);
