import express from 'express';
import { createCompany, createJob, deleteCompany, getAllActiveJobs, getAllApplicationForJob, getAllCompany, getCompanyDetails, getSingleJob, updateApplication, updateJob } from '../controller/jobController.js';
import { isUserAuth } from '../middleware/UserAuth.js';
import uploadFile from '../middleware/multer.js';

const router = express.Router();
router.post('/Company/new', isUserAuth, uploadFile, createCompany);
router.delete('/Company/:companyId', isUserAuth, deleteCompany);
router.post('/new', isUserAuth, createJob);

router.put('/update/:jobId', isUserAuth, updateJob);
router.get('/company/all', isUserAuth, getAllCompany);
router.get('/company/:id', isUserAuth, getCompanyDetails);
router.get('/all', isUserAuth, getAllActiveJobs);
router.get('/:jobId', isUserAuth, getSingleJob);
router.get('/application/all/:jobId', isUserAuth, getAllApplicationForJob);
router.put('/application/update/:id', isUserAuth, updateApplication);




export default router;