import Listing from '../models/listing.model.js';
import { createError } from '../utils/errorHandler.js';

export const createListing = async (req, res, next) => {
    const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, imageUrls, userRef } = req.body;

    try {
        const newListing = new Listing({
            name,
            description,
            address,
            regularPrice,
            discountPrice,
            bathrooms,
            bedrooms,
            furnished,
            parking,
            type,
            offer,
            imageUrls,
            userRef
        });

        await newListing.save();
        res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (error) {
        console.error('Error creating listing:', error);
        next(createError(500, 'Error creating listing'));
    }
};