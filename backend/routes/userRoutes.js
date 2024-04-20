import express from "express";
import {
  registerUser,
  activateUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate-user").post(activateUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);

export default router;
