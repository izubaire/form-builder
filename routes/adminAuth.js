const express = require('express');

const { check, body } = require('express-validator');
const { AdminRegister } = require('../models/admin');

const router = express.Router();

const authController = require('../controllers/adminAuth')

router.get('/login', authController.getLogin);

router.post('/login',
[
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength()
        .isAlphanumeric()
        .trim()
],
 authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignUp);

router.post('/signup',
[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
        return AdminRegister.findOne({email: value})
            .then(adminDoc => {
                if(adminDoc) {
                    return Promise.reject(
                        'E-Mail exists already, Please pick a different one.'
                    );
                }
            });
    })
    .normalizeEmail(),
    body(
        'password',
        'Please eneter a password with only numbers and text and atleast 5 characters.'
    )
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),
    body('confirm_password')
        .trim()
        .custom((value, { req }) => {
        if(value !== req.body.password) {
            throw new Error('Passwords have to match!');
        }
        return true;
        })
], 
authController.postSignUp);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassowrd )

module.exports = router;