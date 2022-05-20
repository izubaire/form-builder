const express = require('express');
const clientAuth = require('../middleware/clientAuth');

const router = express.Router();

const { 
    home,
    admin_form_edit,
    admin_form_update,
    admin_form_delete,
    from_client,
    from_user,
    // from_user_one_time,
    create_form,
    post_create_form,
    create_form_edit,
    update_create_form_edit,
    delete_create_form,
    web_preview,
    post_web_preview
} = require('../controllers/client');

router.get('/', clientAuth, home);

router.get('/from_client', clientAuth, from_client);

router.get('/from_user', clientAuth, from_user);

// for one time show credit number
// router.post('/from_user', clientAuth, from_user_one_time);

router.get('/admin_form/edit/:formId', clientAuth, admin_form_edit);

router.post('/admin_form/edit/:formId', clientAuth, admin_form_update);

router.get('/admin_form/delete/:formId', clientAuth, admin_form_delete);


router.get('/create_form', clientAuth, create_form);

router.post('/create_form', clientAuth, post_create_form);

router.get('/create_form/edit/:formId', clientAuth, create_form_edit);

router.post('/create_form/edit/:formId', clientAuth, update_create_form_edit);

router.get('/create_form/delete/:formId', clientAuth, delete_create_form);

// router.get('/web_preview/:formId', clientAuth, web_preview);

// router.post('/web_preview/:formId', clientAuth, post_web_preview);

module.exports = router;