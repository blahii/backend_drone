const express = require('express');
// Ensure the path is correct
const { register, login } = require('../controllers/authController'); // Check this path
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { supabase } = require('../db/supabase');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is imported

const router = express.Router();

router.post('/register', register); // Handler for registration
router.post('/login', login);       // Handler for login

router.post('/add-service', verifyToken, checkRole('Seller'), async (req, res) => {
    const { title, description, price, sellerId } = req.body;

    // Validate input
    if (!title || !description || !price || !sellerId) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Insert the new service into the services table
        const { data, error } = await supabase
            .from('services') // Assuming you have a 'services' table
            .insert([{ title, description, price, seller_id: sellerId }]); // Adjust the field names as necessary

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

router.get('/services', async (req, res) => {
    try {
        // Fetch all services from the sellers table
        const { data: services, error } = await supabase
            .from('services') // Assuming you have a 'services' table
            .select('*');

        if (error) {
            throw error;
        }

        // Return the list of services
        return res.status(200).json({ services });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Handler for Buyer registration
router.post('/register/buyer', async (req, res) => {
    const { email, password, fullName, industry, country, phone } = req.body;

    // Validate input
    if (!email || !password || !fullName || !country || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the user already exists
        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password: hashedPassword, role: 'buyer', name: fullName }]);

        if (error) {
            throw error;
        }

        // Create a Buyer record
        const buyerId = data[0].id; // Assuming the user ID is returned
        await supabase
            .from('buyers')
            .insert([{ id: buyerId, industry, country, phone }]);

        return res.status(201).json({ message: 'Buyer registered successfully.' });
    } catch (error) {
        console.error('Error registering Buyer:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Handler for Seller registration
router.post('/register/seller', async (req, res) => {
    const { name, partnerType, email, address, password, country, companyName, city, postalCode, phone, insurance, website, instagram, twitter, linkedin, additionalInfo } = req.body;

    // Validate input
    if (!name || !partnerType || !email || !password || !country || !companyName || !city || !postalCode || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if the user already exists
        const existingUser = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser.data) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Create a new user
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, password, role: 'seller', name }]);

        if (error) {
            throw error;
        }

        // Create a Seller record
        const sellerId = data[0].id; // Assuming the user ID is returned
        await supabase
            .from('sellers')
            .insert([{
                id: sellerId,
                company_name: companyName,
                address,
                city,
                postal_code: postalCode,
                country,
                phone,
                website,
                instagram,
                twitter,
                linkedin,
                insurance,
                additional_info: additionalInfo
            }]);

        return res.status(201).json({ message: 'Seller registered successfully.' });
    } catch (error) {
        console.error('Error registering Seller:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Handler for Buyer login
router.post('/login/buyer', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Fetch the user from the database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Here you would typically compare the password (hashed) with the stored password
        // For simplicity, assuming passwords are stored in plain text (not recommended)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful.', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Error logging in Buyer:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Handler for Seller login
router.post('/login/seller', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Fetch the user from the database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Here you would typically compare the password (hashed) with the stored password
        // For simplicity, assuming passwords are stored in plain text (not recommended)
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful.', user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Error logging in Seller:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

console.log('Register function:', register);
console.log('Login function:', login);

module.exports = router;