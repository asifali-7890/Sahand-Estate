import express from 'express';
import { getApiStatus, updateUser, deleteUser, getUserById } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/authMiddleware.js';
import { getUserListings } from '../controllers/listing.controller.js';

const router = express.Router();

router.get('/status', getApiStatus);
router.put('/update/:id', verifyToken, updateUser); // Use the verifyToken middleware
router.delete('/delete/:id', verifyToken, deleteUser); // Add this line
router.get('/listings/:id', verifyToken, getUserListings);
router.get('/:id', verifyToken, getUserById); // Add this line

export default router;