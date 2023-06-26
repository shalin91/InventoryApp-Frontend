const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectToMongo = require("./db");
const userRoute = require("./routes/userRoute");
const errorHandler = require("./middlewares/errorMiddleware")
const cookieParser = require("cookie-parser");
const protect = require("./middlewares/authMiddleware");
const helmet = require("helmet");
const morgan = require("morgan");
const generelRoutes = require("./routes/generelRoutes");
const clientRoutes = require("./routes/clientRoutes");
const salesRoutes = require("./routes/salesRoutes");
const managementRoutes = require("./routes/managementRoutes");
const roleRoutes = require("./routes/roleRoute");



// DATA IMPORTS
const { dataUser} = require("./data/Userdata");
const User = require("./models/User");


// MIDDLEWARES
connectToMongo();
const app = express();
const port = 5000;
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({
    policy : "cross-origin"
}));
app.use(morgan("common"));
app.use(cors());
app.use("/uploads", express.static("./uploads"));


// Routes Middleware
app.use("/api/users" ,userRoute);
app.use("/api" ,roleRoutes);
app.use("/api" ,roleRoutes);
app.use("/general" ,generelRoutes);
app.use("/client" ,clientRoutes);
app.use("/sales" ,salesRoutes);
app.use("/management" ,managementRoutes);

// Error Middleware
app.use(errorHandler);
app.use(protect);

// ROUTES
app.get("/",(req,res)=>{
   res.send("Home Page");
});
app.listen(port,()=>{
    console.log("Server Started on", port);
});

// ONLY ADD DATA ONE TIME
// User.insertMany(dataUser);