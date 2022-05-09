const express = require('express');
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

router.get('/', home);

router.get('/from_client', from_client);

router.get('/from_user', from_user);

// for one time show credit number
// router.post('/from_user', from_user_one_time);

router.get('/admin_form/edit/:formId', admin_form_edit);

router.post('/admin_form/edit/:formId', admin_form_update);

router.get('/admin_form/delete/:formId', admin_form_delete);


router.get('/create_form', create_form);

router.post('/create_form', post_create_form);

router.get('/create_form/edit/:formId', create_form_edit);

router.post('/create_form/edit/:formId', update_create_form_edit);

router.get('/create_form/delete/:formId', delete_create_form);

// router.get('/web_preview/:formId', web_preview);

// router.post('/web_preview/:formId', post_web_preview);

module.exports = router;