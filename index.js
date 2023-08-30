require("dotenv").config();
require("express-async-errors");
const express = require("express");
const fileupload = require("express-fileupload");
const session = require("express-session");
// const bodyParser = require("body-parser")
const passport = require("passport");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");

const User = require("./model/User.db");
const connectDB = require("./db/connect");
const notFoundMiddleWare = require("./handleError/notfound");
const errorHandler = require("./handleError/error");

const router = require("./routes/handler");
const powerRoutes = require("./routes/powerRouter");
const examRoutes = require("./routes/examRouter");
const airtimeRoutes = require("./routes/airtimeRoute");
const dataPlanRoutes = require("./routes/dataPlanRoute");
const tvRoutes = require("./routes/tvRouter");

const port = 4000;
const app = express();

// ************** Middleware ****************
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(fileupload());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 3600000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(express.json());
app.use(flash());
app.use(cookieParser());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ********** Routes **************
app.use("/", router);
app.use("/api/v1/data_plan", dataPlanRoutes);
app.use("/api/v1/airtime", airtimeRoutes);
app.use("/api/v1/tv", tvRoutes);
app.use("/api/v1/power", powerRoutes);
app.use("/api/v1/exam", examRoutes);

app.use(notFoundMiddleWare);
app.use(errorHandler);

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
