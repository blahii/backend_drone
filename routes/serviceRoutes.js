const express = require('express');
const { supabase } = require('../db/supabase'); // Ensure you have the correct path
const router = express.Router();

// Handler for creating a service
router.post('/create-service', async (req, res) => {
    const {
        title,
        description,
        price,
        sellerId,
        category,
        additionalFields
    } = req.body;

    // Validate input
    if (!title || !description || !price || !sellerId || !category) {
        return res.status(400).json({ message: 'Title, description, price, sellerId, and category are required.' });
    }

    // Define required fields based on category
    const requiredFields = {
        'Animation': [
            'numberOfDrones',
            'software',
            'nameOfService',
            'drones',
            'coverImages',
            'speedUpAnimation',
            'basicOrderPreparationTime',
            'formats',
            'aboutService',
            'fastOrderPreparationTime',
            'whatsIncluded'
        ],
        'Drone Show': [
            'nameOfService',
            'coverImages',
            'aboutService',
            'whatsIncluded',
            'numberOfDrones',
            'model',
            'countriesWhereShowCanBePerformed',
            'citiesWhereShowCanBePerformed',
            'unavailableDates',
            'approvalTimeRequired',
            'homeLocation',
            'costPerDronePerShow',
            'costPerDronePerShowWithoutAnimation',
            'filmCrewRental',
            'costOfTheCrew'
        ],
        'Drone Service Aerial': [
            'droneService',
            'dronePilotProfiles',
            'nameOfService',
            'coverImages',
            'aboutService',
            'whatsIncluded',
            'drones',
            'payloads',
            'countriesWhereServiceCanBePerformed',
            'citiesWhereServiceCanBePerformed',
            'costPerDay',
            'productivityPerDay',
            'providingProcessingServices',
            'processingSoftware',
            'quickProcessing',
            'additionalServices',
            'formats',
            'timeForProcessingInDays'
        ],
        'Vertical Inspections Type': [
            'dronePilotProfiles',
            'inspectionsType',
            'typeOfVerticalObjects',
            'nameOfService',
            'coverImages',
            'aboutService',
            'whatsIncluded',
            'drones',
            'payloads',
            'countriesWhereServiceCanBePerformed',
            'citiesWhereServiceCanBePerformed',
            'typeOfObjects',
            'costPerVerticalObject',
            'productivityPerDay',
            'providingProcessingServices',
            'processingSoftware',
            'quickProcessing',
            'formats',
            'timeForProcessingInDays',
            'formatsIncludedInPrice'
        ],
        'Live Event Broadcasting Using Drones': [
            'dronePilotProfiles',
            'droneService',
            'nameOfService',
            'coverImages',
            'aboutService',
            'whatsIncluded',
            'drones',
            'payloads',
            'countriesWhereServiceCanBePerformed',
            'citiesWhereServiceCanBePerformed',
            'costPerHour',
            'providingProcessingServices',
            'quickEditing',
            'timeForEditingInDays',
            'timeForFastEditingInDays'
        ]
    };

    // Check if additional fields are provided for the selected category
    const required = requiredFields[category];
    if (required) {
        for (const field of required) {
            if (!additionalFields || !additionalFields[field]) {
                return res.status(400).json({ message: `${field} is required for ${category}.` });
            }
        }
    }

    try {
        // Insert the new service into the services table
        const { data, error } = await supabase
            .from('services')
            .insert([{
                title,
                description,
                price,
                seller_id: sellerId,
                category,
                ...additionalFields
            }]);

        if (error) {
            throw error;
        }

        // Return success response
        return res.status(201).json({ message: 'Service added successfully.', service: data[0] });
    } catch (error) {
        console.error('Error adding service:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;