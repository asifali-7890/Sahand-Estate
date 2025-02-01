import express from 'express';
import { createListing, getUserListings, deleteListing, updateListing, getListingById, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/authMiddleware.js';

const router = express.Router();

router.post('/create', verifyToken, createListing);
router.get('/:id', verifyToken, getUserListings);
router.delete('/delete/:id', verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateListing);
router.get('/get/all', getListings); // Add this line
router.get('/get/:id', verifyToken, getListingById);

export default router;