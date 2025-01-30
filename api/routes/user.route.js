import express from 'express';
import { getApiStatus, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/status', getApiStatus);
router.put('/update/:id', verifyToken, updateUser); // Use the verifyToken middleware

export default router;