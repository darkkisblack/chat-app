const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { validateLogin, validateRegistration } = require('../middlewares/validationMiddleware');

router.post('/login', validateLogin, login);
router.post('/register', validateRegistration, register);

module.exports = router;
