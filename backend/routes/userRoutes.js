import express from "express";
import { registerUser, activateUser } from "../controllers/userController.js";
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/activate-user").post(activateUser);

export default router;
