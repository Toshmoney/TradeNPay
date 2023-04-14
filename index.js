require("dotenv").config();
require("./model/User.db")
const connectDB = require("./db/connect")
// require("express-async-error")
const notFoundMiddleWare = require("./handleError/notfound")
const handleError = require("./handleError/error")
const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const router = require("./routes/handler");
const errorHandler = require("./handleError/error");
const port = 4000;

const dataPlanRoutes = require('./routes/dataPlanRoute')

// ************** Middleware ****************
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));
app.use(express.json())

// ********** Routes **************
app.use("/", router);
app.use("/api/v1/data_plan", dataPlanRoutes)

app.use(errorHandler)
app.use(notFoundMiddleWare)

const start = async ()=>{
    try {
        // await connectDB(process.env.connectionString);
        console.log("Success!!!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`);
        });
    } catch (error) {
        console.log(error);
    }
}

start();