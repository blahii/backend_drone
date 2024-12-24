const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register); // Обработчик регистрации
router.post('/login', login);       // Обработчик логина

module.exports = router;
