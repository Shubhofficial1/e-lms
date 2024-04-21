import asyncHandler from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { redis } from "../config/redis.js";

const protect = asyncHandler(async (req, res, next) => {
  const access_token = req.cookies.access_token;

  if (!access_token) {
    res.status(404);
    throw new Error("Please login to access this resource");
  }

  const decodedUser = jwt.verify(access_token, process.env.ACCESS_TOKEN);

  if (!decodedUser) {
    res.status(401);
    throw new Error("Access token is not valid");
  }

  const user = await redis.get(decodedUser.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  req.user = JSON.parse(user);

  next();
});

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req?.user?.role === "Admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an admin");
  }
});

export { protect, admin };
