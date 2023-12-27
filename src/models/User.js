const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => /\S+@\S+\.\S+/.test(value),
      message: "Must be a valid email address",
    },
  },
  phone_number: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["superadmin", "admin", "user"],
  },
  isEmailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatched = await bcrypt.compare(candidatePassword, this.password);
    return isMatched;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
