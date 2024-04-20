import { Redis } from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis connected Successfully".magenta.bold);
    return process.env.REDIS_URL;
  } else {
    throw new Error("Redis Connection failed.");
  }
};

export const redis = new Redis(redisClient());
