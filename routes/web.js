// const { ClientRegister, AdminRegister, FormCreate, UserForm } = require('../models/admin')
const { FormCreate, User, UserForm } = require('../models/admin');

const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.render('web/index');
});

router.get('/:formId', (req, res, next) => {
    const formId = req.params.formId;

    FormCreate.findById(formId)
        .then(preview => {
            res.render('client/web_preview', {
                preview,
                formId
            });
        })
        .catch(err => {
            console.log(err);
        })
});

router.post('/:formId', (req, res, next) => {
    console.log(req.body);
    const client_id = req.session.client._id;
    const form_id = req.params.formId;

    // req.body.client_id = req.session.client._id;
    // req.body.form_id = req.params.formId;
    // const userDetails = new UserForm(req.body);
    // userDetails.save()
    //     .then(result => {
    //         console.log(result);
    //         res.redirect('/');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    FormCreate
        .updateOne(
            {_id: form_id},
            { $push: { user_details: req.body } }
        )
        .then(formdata => {
            console.log(formdata);
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;