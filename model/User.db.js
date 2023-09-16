const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      required: [true, "Must provide fullname"],
      type: String,
      trim: true,
    },
    email: {
      required: [true, "Username is required!!"],
      type: String,
      trim: true,
    },
    phoneNumber: {
      required: [true, "phoneNumber is required!!"],
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      trim: true,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    has_set_pin: {
      type: Boolean,
      default: false,
    },
    resetToken: String,
    resetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
