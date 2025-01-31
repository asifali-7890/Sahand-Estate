import Listing from '../models/listing.model.js';
import { createError } from '../utils/errorHandler.js';

export const createListing = async (req, res, next) => {
    const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer, userRef } = req.body;

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
            userRef
        });

        await newListing.save();
        res.status(201).json({ message: 'Listing created successfully', listing: newListing });
    } catch (error) {
        console.error('Error creating listing:', error);
        next(createError(500, 'Error creating listing'));
    }
};

export const getUserListings = async (req, res, next) => {
    const { id } = req.params;

    try {
        const listings = await Listing.find({ userRef: id });
        if (!listings) {
            return next(createError(404, 'Listings not found'));
        }
        res.status(200).json({ message: 'Listings retrieved successfully', listings });
    } catch (error) {
        console.error('Error retrieving listings:', error);
        next(createError(500, 'Error retrieving listings'));
    }
};

export const deleteListing = async (req, res, next) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return next(createError(404, 'Listing not found'));
        }
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error('Error deleting listing:', error);
        next(createError(500, 'Error deleting listing'));
    }
};

export const updateListing = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, address, regularPrice, discountPrice, bathrooms, bedrooms, furnished, parking, type, offer } = req.body;

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return next(createError(404, 'Listing not found'));
        }

        listing.name = name || listing.name;
        listing.description = description || listing.description;
        listing.address = address || listing.address;
        listing.regularPrice = regularPrice || listing.regularPrice;
        listing.discountPrice = discountPrice || listing.discountPrice;
        listing.bathrooms = bathrooms || listing.bathrooms;
        listing.bedrooms = bedrooms || listing.bedrooms;
        listing.furnished = furnished || listing.furnished;
        listing.parking = parking || listing.parking;
        listing.type = type || listing.type;
        listing.offer = offer || listing.offer;

        await listing.save();
        res.status(200).json({ message: 'Listing updated successfully', listing });
    } catch (error) {
        console.error('Error updating listing:', error);
        next(createError(500, 'Error updating listing'));
    }
};