const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const rootDir = require("./utility/path");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require("connect-flash");
const dotenv = require("dotenv").config();

const error = require("./middleware/error");

const { AdminRegister } = require("./models/admin");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoute = require("./routes/admin");
const adminAuthRoute = require("./routes/adminAuth");
const clientRoute = require("./routes/client");
const clientAuthRoute = require("./routes/clientAuth");
const webRoute = require("./routes/web");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
  res.locals.adminAuthenticated = req.session.adminLoggedIn;
  res.locals.clientAuthenticated = req.session.clientLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoute);
app.use("/admin", adminAuthRoute);
app.use("/client", clientRoute);
app.use("/client", clientAuthRoute);
app.use("/", webRoute);

app.use(error);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("db Connected");
    app.listen(process.env.PORT || 3000, function () {
      console.log("server started");
    });
  })
  .catch((err) => {
    console.log(err);
  });
