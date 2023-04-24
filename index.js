require("dotenv").config();
const connectDB = require("./db/connect")
const notFoundMiddleWare = require("./handleError/notfound")
const express = require("express");
const router = require("./routes/handler");
const errorHandler = require("./handleError/error");
const port = 4000;

const airtimeRoutes = require('./routes/airtimeRoute')
const dataPlanRoutes = require('./routes/dataPlanRoute')
const User = require('./model/User.db')

const session = require("express-session")
// const bodyParser = require("body-parser")
const passport = require("passport")
const flash = require("connect-flash")
const cookieParser = require("cookie-parser")

const app = express();

// ************** Middleware ****************
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended:false }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 3600000
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static("public"));
app.use(express.json())
app.use(flash())
app.use(cookieParser())

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// ********** Routes **************
app.use("/", router);
app.use("/api/v1/data_plan", dataPlanRoutes)
app.use("/api/v1/airtime", airtimeRoutes)

app.use(errorHandler)
app.use(notFoundMiddleWare)

const start = async () =>{
    try {
        await connectDB();
        console.log("Success!!!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();