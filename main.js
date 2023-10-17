const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./config/db");
var bodyParser = require("body-parser");

// require all routes

const adminRoute = require("./routes/admin.route");

// require auth middleware
const adminAuth = require("./middleware/admin.auth");

// DB-Connection
connection();

// middlewares

//  use  cors to run multiple servers
app.use(cors());

//  express's body parser to convetert data into JSON form
app.use(express.json());
// to parse data in json
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

//-----defining base routes of all entities--------

// <--------------------------OPEN ROUTES----------------------------->
// auth for login and signup
app.post("/auth/adminRegister", adminAuth.registerAdmin);
app.post("/auth/adminLogin", adminAuth.loginAdmin);
app.post("/auth/login", adminAuth.loginUser);

// auth globle middleware
app.use(adminAuth.authenticateAdmin);

// <--------------------------PROTECTED ROUTES----------------------------->
// admin route
app.use("/api/admin", adminRoute);

// start node server
const PORT = process.env.PORT || 4000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
