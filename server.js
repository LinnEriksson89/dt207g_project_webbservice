/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

"use strict";

//Constants and requriements.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const lunchRoutes = require("./routes/lunchRoutes");

//Use JSON in API-calls.
app.use(express.json());

//Activate CORS middleware for all routes.
app.use(cors({
    origin: "*",
    methods: "GET, PUT, POST, DELETE"
}));

//To be able to send data with post.
app.use(express.urlencoded({
    extended:true
}));

//Routes.
app.use("/api/accounts/", authRoutes);
app.use("/api/food/", foodRoutes);
app.use("/api/category/", categoryRoutes);
app.use("/api/lunch/", lunchRoutes);

//Route not found.
app.all("*", (req, res) => {
    res.status(404).json({message: "Route not found."});
});

app.listen(port, () => {
    console.log("Server running on port: " + port);
});