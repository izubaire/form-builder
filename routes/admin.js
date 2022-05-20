const express = require('express');
const adminAuth = require('../middleware/adminAuth');

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

router.get('/', adminAuth,  home); 

router.get('/client_register', adminAuth, clientRegister);

router.post('/client_register', adminAuth, postClientRegistration);

router.get('/form_detail/:clientId', adminAuth, formDetail);

router.post('/form_detail/:formId', adminAuth, deleteFormDetail);

router.get('/client_detail/:clientId', adminAuth, clientDetail);

router.post('/client_detail/update/:clientId', adminAuth, updateClientDetail);

router.post('/client_detail/delete/:clientId', adminAuth, deleteClientDetail);

router.get('/create_form', adminAuth, createForm);

router.get('/create_form/edit/:formId', adminAuth, createFormEdit);

router.post('/create_form/edit/:formId', adminAuth, updateCreateFormEdit);

router.post('/create_form', adminAuth, postCreateForm);

router.get('/web_preview/:formId', adminAuth, webPreview);

module.exports = router;