/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

//Constants and requriements.
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");

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
//app.use("/api/foodcat/", categoryRoutes);

app.listen(port, () => {
    console.log("Server running on port: " + port);
});

