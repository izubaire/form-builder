const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { AdminRegister } = require("../models/admin");

const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "aa464774ded6b73323be8fdb7c11765d",
  apiSecret:
    process.env.MJ_APIKEY_PRIVATE || "4cc52abd2d5fe9123999d7c3824fa7bf",
});

const { validationResult } = require("express-validator");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/auth/login", {
    path: "/admin/login",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/auth/login", {
      path: "/login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  AdminRegister.findOne({ email: email }).then((admin) => {
    if (!admin) {
      console.log("email not found", admin);
      return res.status(422).render("admin/auth/login", {
        path: "/admin/login",
        errorMessage: "Invalid email or password.",
        oldInput: {
          email: email,
          password: password,
        },
        validationErrors: [],
      });
    }
    bcrypt
      .compare(password, admin.password)
      .then((doMatch) => {
        if (doMatch) {
          console.log("password match block");
          req.session.adminLoggedIn = true;
          req.session.admin = admin;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/admin");
          });
        }
        return res.status(422).render("admin/auth/login", {
          path: "/login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      })
      .catch((err) => {
        console.log(err);
        res.redirect("/admin/login");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/admin/login");
  });
  req.session.adminLoggedIn = false;
  req.session.admin = false;
  return req.session.save((err) => {
    console.log(err);
    res.redirect("/admin");
  });
};

exports.getSignUp = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/auth/signup", {
    path: "/admin/signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postSignUp = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/auth/signup", {
      path: "/admin/signup",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const clientRegister = new AdminRegister({
        email: email,
        password: hashedPassword,
      });
      return clientRegister.save();
    })
    .then((result) => {
      res.redirect("/admin/login");
      // return mailjet
      //     .post("send", {'version': 'v3.1'})
      //     .request({
      //     "Messages":[
      //         {
      //         "From": {
      //             "Email": "enter your email",
      //             "Name": "enter you name"
      //         },
      //         "To": [
      //             {
      //             "Email": email,
      //             // "Name": "pc"
      //             }
      //         ],
      //         "Subject": "Signup succeeded!",
      //         "TextPart": "My first Mailjet email",
      //         "HTMLPart": "<h3>You successfully signed up!</h3>",
      //         "CustomID": "AppGettingStartedTest"
      //         }
      //     ]
      //     })
      //     .then(result => {
      //         console.log(result.body);
      //     })
      //     .catch(err => {
      //         console.log(err);
      //     });
    })
    .catch((err) => {
      console.log(err);
    });
  // })
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("admin/auth/reset", {
    path: "/admin/reset",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/admin/reset");
    }
    const token = buffer.toString("hex");
    AdminRegister.findOne({ email: req.body.email })
      .then((admin) => {
        if (!admin) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/admin/reset");
        }
        admin.resetToken = token;
        admin.resetTokenExpiration = Date.now() + 3600000;
        return admin.save();
      })
      .then((result) => {
        console.log("admin", result);
        res.redirect("/admin/login");
        // return mailjet.post("send", { version: "v3.1" }).request({
        //   Messages: [
        //     {
        //       From: {
        //         Email: "enter your email",
        //         Name: "enter your name",
        //       },
        //       To: [
        //         {
        //           Email: req.body.email,
        //           // "Name": "pc"
        //         },
        //       ],
        //       Subject: "Password Reset",
        //       TextPart: "My first Mailjet email",
        //       HTMLPart: `
        //                     <p>You requested a password reset</p>
        //                     <p>Click this <a href="http://localhost:3000/admin/reset/${token}">link</a> to set a new password.</p>
        //                 `,
        //       CustomID: "AppGettingStartedTest",
        //     },
        //   ],
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  AdminRegister.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((admin) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("admin/auth/new-password", {
        path: "/admin/reset",
        errorMessage: message,
        adminId: admin._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassowrd = (req, res, next) => {
  const newPassword = req.body.password;
  const adminId = req.body.adminId;
  const passwordToken = req.body.passwordToken;
  let resetAdmin;

  AdminRegister.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: adminId,
  })
    .then((admin) => {
      resetAdmin = admin;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetAdmin.password = hashedPassword;
      resetAdmin.resetToken = undefined;
      resetAdmin.resetTokenExpiration = undefined;
      return resetAdmin.save();
    })
    .then((result) => {
      res.redirect("/admin/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
