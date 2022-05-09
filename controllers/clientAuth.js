const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { AdminRegister, ClientRegister } = require('../models/admin');
const { validationResult } = require('express-validator');

const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE
})

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('client/auth/login', {
        path: 'login',
        title: 'login',
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('client/auth/login', {
            path: 'login',
            title: 'login',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    ClientRegister.findOne({ email: email, password: password })
    .then(client => {
        console.log('check email');
        if(!client) {
            return res.status(422).render('client/auth/login', {
                path: 'login',
                title: 'login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        }
         
        bcrypt.compare(password, client.password)
        .then(doMatch => {
            if(doMatch){
                req.session.clientLoggedIn = true;
                req.session.client = client;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/client');
                })
            }
            return res.status(422).render('client/auth/login', {
                path: 'login',
                title: 'login',
                errorMessage: 'Invalid email or password.',
                oldInput: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('client/login');
        });
    })
    .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy( err => {
        console.log(err);
        res.redirect('/client/login');
    });
    req.session.clientLoggedIn = false;
    req.session.client = '';
    return req.session.save(err => {
        console.log(err);
        res.redirect('/client/login');
    })
}