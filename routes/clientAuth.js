const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/clientAuth');

router.get('/login', authController.getLogin);

router.post('/login',
[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min:5 })
        // .isAlphanumeric()
        .trim()
]
, authController.postLogin);

router.post('/logout', authController.postLogout);

module.exports = router;