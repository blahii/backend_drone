const express = require('express');
// Ensure the path is correct
const { register, login } = require('../controllers/authController'); // Check this path

const router = express.Router();

router.post('/register', register); // Handler for registration
router.post('/login', login);       // Handler for login

console.log('Register function:', register);
console.log('Login function:', login);

module.exports = router;