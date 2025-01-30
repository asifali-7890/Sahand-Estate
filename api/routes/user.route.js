import express from 'express';
import { getApiStatus, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.get('/status', getApiStatus);
router.put('/update/:id', verifyToken, updateUser); // Use the verifyToken middleware
router.delete('/delete/:id', verifyToken, deleteUser); // Add this line

export default router;