import express from "express";
import { createUser, getUser } from "../controllers/user.controllers.js";
import isAuth from "../middleware/isAuth.middleware.js";

const router = express.Router();

router.post("/createUser", createUser);
router.post("/signin", signin);
router.post("/getUserDetails", isAuth, getUserDetails);

export default router;
