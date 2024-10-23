import express from "express";
import {
  createUser,
  getUserDetails,
  signIn,
} from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/signin", signIn);
router.post("/getUserDetails", isAuth, getUserDetails);

export default router;
