const express = require('express');

const router = express.Router();

const { 
    home,
    clientRegister,
    postClientRegistration,
    formDetail,
    deleteFormDetail,
    clientDetail,
    updateClientDetail,
    deleteClientDetail,
    createForm,
    createFormEdit, 
    updateCreateFormEdit,
    postCreateForm,
    postCreateFormPreview,
    webPreview,
} = require('../controllers/admin');

router.get('/',  home); 

router.get('/client_register', clientRegister);

router.post('/client_register', postClientRegistration);

router.get('/form_detail/:clientId', formDetail);

router.post('/form_detail/:formId', deleteFormDetail);

router.get('/client_detail/:clientId', clientDetail);

router.post('/client_detail/update/:clientId', updateClientDetail);

router.post('/client_detail/delete/:clientId', deleteClientDetail);

router.get('/create_form', createForm);

router.get('/create_form/edit/:formId', createFormEdit);

router.post('/create_form/edit/:formId', updateCreateFormEdit);

router.post('/create_form', postCreateForm);

router.get('/web_preview/:formId', webPreview);

module.exports = router;