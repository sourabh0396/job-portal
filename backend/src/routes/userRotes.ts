import express from "express";
import { isUserAuth } from "../middleware/UserAuth.js";
import { addSkilltoUser, applyToJob, deleteSkillFromUser, getAllApplications, getUserProfile, MyProfile, updatedUserProfile, updateProfilePic, updateResume } from "../controller/userController.js";
import uploadFile from "../middleware/multer.js";

const router = express.Router();
router.get('/me', isUserAuth, MyProfile);
router.get('/:userId', isUserAuth, getUserProfile);
router.put('/update/profile', isUserAuth, updatedUserProfile);
router.put('/update/pic', isUserAuth, uploadFile, updateProfilePic);
router.put('/update/resume', isUserAuth, uploadFile, updateResume);
router.post('/skill/add', isUserAuth, addSkilltoUser);
router.delete('/skill/delete', isUserAuth, deleteSkillFromUser);
router.post('/apply/job', isUserAuth, applyToJob);
router.get('/applications/all', isUserAuth, getAllApplications);
export default router;