import express from "express";
import { isUserAuth } from "../middleware/UserAuth.js";
import { MyProfile } from "../controller/userController.js";

const router = express.Router();
router.get('/me', isUserAuth, MyProfile)
export default router;