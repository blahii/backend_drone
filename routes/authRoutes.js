const express = require('express');
// Ensure the path is correct
const { register, login } = require('../controllers       /authController'); // Check this path

const router = express.Router();

router.post('/register', register); // Обработчик регистрации
router.post('/login', login);       // Обработчик логина

module.exports = router;