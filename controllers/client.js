const { ClientRegister, AdminRegister, FormCreate, UserForm } = require('../models/admin')

exports.home = (req, res, next) => {
    ClientRegister
        .findOne({_id: req.session.client._id})
        .populate('forms')
        .then(client => {
            console.log('client detail',client);
            res.render('client/from_admin', {
                path: 'from_admin',
                title: 'Dashboard',
                clientInfo: client
            });
        })
}
exports.admin_form_edit = (req, res, next ) => {
    const formId = req.params.formId;
    FormCreate.findById(formId)
     .then(form => {
        console.log("formBody", form.formBody);

        ClientRegister.findById(form.selectedClient)
        .then(client => {
            res.render('client/create_form_edit', {
                path: 'from_admin',
                title: 'Edit Form',
                form,
                clientInfo: client
            })
        })
        .catch(err => {
            console.log(err);
        })
        
     })
     .catch(err => {
        console.log(err);
     })
}
exports.admin_form_update = (req, res, next ) => {
    const formId = req.params.formId;
    const data = req.body;
    FormCreate.findById(formId)
     .then(form => {
         FormCreate.updateOne(
             {_id: formId},
             {$set: data}
         )
          .then(result => {
             res.send(form);
          })
          .catch(err => {
             console.log(err);
          })
     })
     .catch(err => {
        console.log(err);
     })
}
exports.admin_form_delete = (req, res, next ) => {
    const formId = req.params.formId;
    FormCreate.findByIdAndRemove(formId)
        .then(form => {
            ClientRegister
                .updateOne(
                    {_id: form.selectedClient},
                    { $pull: { forms: form._id } }
                )
                .then(client => {
                    res.redirect('/client');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        })

}
exports.from_client = (req, res, next) => {
    ClientRegister
        .findOne({_id: req.session.client._id})
        .populate('client_forms')
        .then(client => {
            res.render('client/from_client', {
                path: 'from_client',
                title: 'From Client',
                clientInfo: client
            });
        })
}

exports.from_user = (req, res, next) => {
    FormCreate
        .find({selectedClient: req.session.client._id})
        // .populate('client_details')
        // UserForm
        // .find({client_id: req.session.client._id})
        .then(user => {
            console.log(user);
            // return
            // console.log('userData', user[0].user_details);
            res.render('client/from_user', {
                path: 'from_user',
                title: 'From User',
                userForms: user,
            });
        })
}
exports.from_user_one_time = (req, res, next) => {
    console.log('working request', req.body);
    res.send();
}

exports.create_form = (req, res, next) => {
    ClientRegister.findById({_id: req.session.client._id})
        .then(client => {
            console.log(client);
            res.render('client/create_form', {
                path: 'create_form',
                title: 'Create Form',
                clientInfo: client
            });
        })
        .catch(err => {
            console.log(err);
        })
}
exports.post_create_form = (req, res, next) => {
    const formBody = req.body.formBody;
    const formBuilder = req.body.formBuilder;
    const formName = req.body.formName;
    const selectedClient = req.body.selectedClient;
    const logoName = req.body.logoName;
    const formHeading = req.body.formHeading;
    const formSubHeading = req.body.formSubHeading;
    const createForm = new FormCreate({
        formBody,
        formBuilder,
        formName,
        selectedClient,
        logoName,
        formHeading,
        formSubHeading
    });
    createForm.save()
    .then(form => {
            ClientRegister
                .updateOne(
                    {_id: selectedClient},
                    { $push: { client_forms: form._id } }
                )
                .then(client => {
                    // console.log(client);
                    res.send(form);
                })
                .catch(err => {
                    console.log(err);
                });
    })
    .catch(err => {
        console.log(err);
    });
    if (!req.body) return res.status(500).send('please fill the correct fields.');
};

exports.create_form_edit = (req, res, next) => {
    const formId = req.params.formId;
    FormCreate.findById(formId)
     .then(form => {
        console.log("formBody", form.formBody);
        ClientRegister.findById(form.selectedClient)
        .then(client => {
            // console.log(client);
            res.render('client/create_form_edit', {
                path: 'create_form',
                title: 'Edit Form',
                form,
                clientInfo: client
            })
        })
        .catch(err => {
            console.log(err);
        })
        
     })
     .catch(err => {
        console.log(err);
     })
}

exports.update_create_form_edit = (req, res, next) => {
    const formId = req.params.formId;
    const data = req.body;
    FormCreate.findById(formId)
     .then(form => {
         FormCreate.updateOne(
             {_id: formId},
             {$set: data}
         )
          .then(result => {
             res.send(form);
          })
          .catch(err => {
             console.log(err);
          })
     })
     .catch(err => {
        console.log(err);
     })
}

exports.delete_create_form = (req, res, next) => {
    const formId = req.params.formId;
    FormCreate.findByIdAndRemove(formId)
        .then(form => {
            ClientRegister
                .updateOne(
                    {_id: form.selectedClient},
                    { $pull: { client_forms: form._id } }
                )
                .then(client => {
                    // console.log(client);
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.web_preview = (req, res, next) => {
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
}

exports.post_web_preview = (req, res, next) => {
    const client_id = req.session.client._id;
    const form_id = req.params.formId
    FormCreate
        .updateOne(
            {_id: form_id},
            { $push: { user_details: req.body } }
        )
        .then(formdata => {
            console.log(formdata);
            res.redirect('/client');
        })
        .catch(err => {
            console.log(err);
        });
}