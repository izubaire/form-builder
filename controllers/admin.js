const { ClientRegister, FormCreate, userForm } = require('../models/admin') 


exports.home = (req, res, next) => {
     ClientRegister.find({created_by: req.session.admin._id})
     .then(clients => {
         res.render('admin/index', {
             path: '/admin',
             clients,
         });
     })
     .catch(err => {
        console.log(err);
     });
};

exports.clientRegister = (req, res, next) => {
    res.render('admin/client_register',{
        path: '/admin',
    });
};

exports.postClientRegistration = (req, res, next) => {
    req.body.created_by = req.session.admin._id;
    console.log(req.body);
    const clientRegister = new ClientRegister(req.body);
    clientRegister.save()
        .then(result => {
            res.redirect('/admin');
        })
        .catch(err => {
            console.log(err);
        })
    if (!req.body) return res.status(500).send('please fill the correct fields.');
};

exports.formDetail = (req, res, next) => {
    const clientId = req.params.clientId;
    ClientRegister
        .findById(clientId)
        .populate('forms')
        .then(client => {
            res.render('admin/form_detail',{
                path: '/admin',
                clientInfo: client,
            });
        })
        .catch(err => console.log('controller',err));
};

exports.deleteFormDetail = (req, res, next) => {
    const formId = req.params.formId;
    FormCreate.findByIdAndRemove(formId)
        .then(form => {
            console.log(form.selectedClient, form._id);
            ClientRegister
                .updateOne(
                    {_id: form.selectedClient},
                    { $pull: { forms: form._id } }
                )
                .then(client => {
                    res.redirect('/admin');
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log(err);
        })
}

exports.clientDetail = (req, res, next) => {
    const clientId = req.params.clientId;
    ClientRegister.findById(clientId)
        .then(client => {
            res.render('admin/client_detail', {
                path: '/admin',
                clientInfo: client
            });
        })
        .catch(err => console.log('controller',err));
};

exports.updateClientDetail = (req, res, next) => {
    const clientId = req.params.clientId;
    let data = req.body
    ClientRegister
    .updateOne(
        {_id: clientId},
        {$set: data}
    )
    .then(client => {
        res.redirect('/admin');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.deleteClientDetail = (req, res, next) => {
    const clientId = req.params.clientId;
    console.log(clientId);
    ClientRegister.findById(clientId)
        .then(client => {
            FormCreate.deleteMany({ _id: { $in: client.forms } })
             .then(result => {
                userForm.deleteMany({ _id: { $in: client.client_forms }})
                    .then(result => {
                        ClientRegister.findByIdAndRemove(clientId)
                         .then(result => {
                            res.redirect('/admin');
                         })
                         .catch(err => {
                            console.log(err);
                         })
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

exports.createForm = (req, res, next) => {
    ClientRegister.find({created_by: req.session.admin._id})
        .then(client => {
            res.render('admin/create_form', {
                path: '/admin/create_form',
                clientInfo: client
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCreateForm = (req, res, next) => {
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
        formSubHeading,
    });
    createForm.save()
    .then(form => {
            ClientRegister
                .updateOne(
                    {_id: selectedClient},
                    { $push: { forms: form._id } }
                )
                .then(client => {
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

exports.createFormEdit = (req, res, next) => {
    const formId = req.params.formId;
    FormCreate.findById(formId)
     .then(form => {
        ClientRegister.findById(form.selectedClient)
        .then(client => {
            res.render('admin/create_form_edit', {
                path: '/admin/create_form',
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

exports.updateCreateFormEdit = (req, res, next) => {
    const formId = req.params.formId;
    const data = req.body;
    FormCreate.findById(formId)
     .then(form => {
         FormCreate.updateOne(
             {_id: formId},
             {$set: data}
         )
          .then(result => {
             console.log("update form result", result);
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

exports.webPreview = (req, res, next) => {
    const formId = req.params.formId;
    FormCreate.findById(formId)
        .then(preview => {
            console.log("Web Preview",preview.formBody);
            res.render('admin/web_preview', {
                preview
            });
        })
        .catch(err => {
            console.log(err);
        })
}