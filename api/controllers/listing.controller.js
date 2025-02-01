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

export const getListingById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const listing = await Listing.findById(id);
        if (!listing) {
            return next(createError(404, 'Listing not found'));
        }
        res.status(200).json({ message: 'Listing retrieved successfully', listing });
    } catch (error) {
        console.error('Error retrieving listing:', error);
        next(createError(500, 'Error retrieving listing'));
    }
};


export const getListings = async (req, res, next) => {
    console.log('Request reached getListings'); // Add this line
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;

        if (offer === undefined || offer === 'false') {
            offer = { $in: [false, true] };
        }

        let furnished = req.query.furnished;

        if (furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true] };
        }

        let parking = req.query.parking;

        if (parking === undefined || parking === 'false') {
            parking = { $in: [false, true] };
        }

        let type = req.query.type;

        if (type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';

        const order = req.query.order || 'desc';

        console.log('Query Parameters:', {
            limit,
            startIndex,
            offer,
            furnished,
            parking,
            type,
            searchTerm,
            sort,
            order
        });

        const listings = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        console.log('Listings:', listings);

        return res.status(200).json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        next(error);
    }
};