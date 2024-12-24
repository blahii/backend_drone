require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes'); // Подключаем маршруты аутентификации

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());  // Для обработки JSON запросов
app.use('/api/auth', authRoutes);  // Маршруты аутентификации

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
