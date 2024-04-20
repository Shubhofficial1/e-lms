import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import jwt from "jsonwebtoken";
import sendMail from "../utils/sendMail.js";
import createActivationToken from "../utils/createActivationToken.js";
import dotenv from "dotenv";
dotenv.config();

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    res.status(400);
    throw new Error("User already exists with this email.");
  }

  const user = {
    name,
    email,
    password,
  };

  const activationToken = createActivationToken(user);
  const activationCode = activationToken.activationCode;
  const data = { user: { name: user.name }, activationCode };

  await sendMail({
    email: user.email,
    subject: "Activate your account",
    template: "activation-mail.ejs",
    data,
  });

  res.status(201).json({
    success: true,
    message: `Please check your email : ${user.email} to activate your account.`,
    activationToken: activationToken.token,
  });
});

const activateUser = asyncHandler(async (req, res) => {
  const { activation_token, activation_code } = req.body;

  if (!activation_token || !activation_code) {
    res.status(400);
    throw new Error("Invalid Request Body");
  }

  const decodedUser = jwt.verify(
    activation_token,
    process.env.ACTIVATION_SECRET
  );

  if (decodedUser.activationCode !== activation_code) {
    res.status(400);
    throw new Error("Invalid Activation Code");
  }

  const { name, email, password } = decodedUser.user;

  const existsUser = await User.findOne({ email });

  if (existsUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      success: true,
    });
  } else {
    res.status(400);
    throw new Error("Something went wrong");
  }
});

export { registerUser, activateUser };
