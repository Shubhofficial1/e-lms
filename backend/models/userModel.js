import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const emailRegexPatter = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: "string",
      required: ["true", "Please enter your name"],
    },
    email: {
      type: "string",
      unique: true,
      required: ["true", "Please enter your email"],
      validate: {
        validator: function (value) {
          return emailRegexPatter.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: "string",
      required: ["true", "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    avatar: {
      public_id: "string",
      url: "string",
    },
    role: {
      type: "string",
      default: "User",
      enum: ["User", "Admin", "Instructor"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: "string",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
