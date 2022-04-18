const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientRegistrationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    forms: [{
        type: Schema.Types.ObjectId ,
        ref: 'FormCreate'
    }],
    client_forms: [{
        type: Schema.Types.ObjectId ,
        ref: 'FormCreate'
    }],
    created_by: {
        type: String ,
        required: true
    }
});

const adminRegisterSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirm_password: {
        type: String,
    },
    resetToken: String,
    resetTokenExpiration: Date,
})

const formSchema = mongoose.Schema({
    formBody: {
        type: String,
        required: true
    },
    formBuilder: {
        type: String,
        required: true
    },
    formName: {
        type: String,
        required: true
    },
    selectedClient: {
        type: String,
        required: true
    },
    logoName: {
        type: String,
        required: true
    },
    formHeading: {
        type: String,
        required: true
    },
    formSubHeading: {
        type: String,
        required: true
    },
    
    user_details : { type : Array , "default" : [] }
});

const userFormSchema = new mongoose.Schema({

}, { strict: false});

module.exports.ClientRegister = mongoose.model('ClientRegister', clientRegistrationSchema);
module.exports.FormCreate = mongoose.model('FormCreate', formSchema);
module.exports.AdminRegister = mongoose.model('AdminRegister', adminRegisterSchema);
module.exports.UserForm = mongoose.model('UserForm', userFormSchema);
