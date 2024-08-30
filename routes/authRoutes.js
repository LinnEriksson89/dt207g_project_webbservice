/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */


//Routes for authorized users, handles login, register etc.
//Constants and requirements.
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//Connect to user-database.
mongoose.connect(process.env.USER_DBLINK)
    .then(() => {
        console.log("Connected to mongoDB");
    }).catch((err) =>{
        console.log("Error connecting to database: " + err);
    });

//User model.
const User = require("../models/User");

//Register new account.
router.post("/register", async (req, res) => {
    //Variables from the body
    const username = req.body.username;
    const password = req.body.password;

    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {
            message: "",
            code: 0
        }
    };

    //If-else to validate input.
    if(!username || !password) {
        //Error message and response code for missing username or password.
        error.message = "Information missing!";
        error.details = "Adding a user requires both a username and a password.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error-message and return.
        res.status(400).json(error);
        return;
    }else if(username.length < 4 || username.length > 32){
        //Error message and response code for too long or short username.
        error.message = "Incorrect information!";
        error.details = "Username has to be between 4 and 32 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(password.length < 16 || password.length > 128) {
        //Error message and response code for too long or short password.
        error.message = "Incorrect information!";
        error.details = "Password has to be between 16 and 128 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else {
        //Username and password has passed first validation and we can now try to add user.
        try {
            //Variable for user and checking if username is already in use.
            const user = new User({username, password});
            const previousUser = await User.findOne({username});

            //If username is already in use.
            if(previousUser){
                error.message = "Username not available!";
                error.details = "Usernames are unique and a user with this username already exists.";
                error.https_response.message = "Bad Request!";
                error.https_response.code = 400;

                //Send error message and return.
                res.status(400).json(error);
                return;
            } else {
                //If username does not already exists we can save user.
                let result = await user.save();
                
                if(!result) {
                    //If result is empty something went wrong.
                    error.message = "Something went wrong!";
                    error.details = "";
                    error.https_response.message = "Internal server error.";
                    error.https_response.code = 500;
                    
                    //Send error message and return.
                    res.status(500).json(error);
                    return;
                } else {
                    //Inform that user has been saved to database and return.
                    res.status(201).json({message: "User created!"});
                    return;
                }
            }
        } catch (err) {
            //If something goes wrong.
            error.message = "Something went wrong!";
            error.details = err;
            error.https_response.message = "Internal server error.";
            error.https_response.code = 500;

            //Send error message.
            res.status(500).json(error);
        }
    }
});

//Login to account.
router.post("/login", async (req, res) => {
    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {
            message: "",
            code: 0
        }
    };

    //Try-catch for actual login.
    try {
        //Variables from body.
        const username = req.body.username;
        const password = req.body.password;

        if(!username || !password) {
            //Error message and response code for missing username or password.
            error.message = "Information missing!";
            error.details = "Log in requires both a username and a password.";
            error.https_response.message = "Bad request!";
            error.https_response.code = 400;

            //Send error-message and return.
            res.status(400).json(error);
            return;
        } else {
            //If username and password is included we can check if the user exists.
            const user = await User.findOne({username});

            if (!user) {
                //Error message and response code for invalid user.
                error.message = "Information missing!";
                error.details = "Log in requires correct username and a password.";
                error.https_response.message = "Unauthorized!";
                error.https_response.code = 401;

                //Send error-message and return.
                res.status(401).json(error);
                return;
                
            } else {
                //If the user exists we can check password.
                const isPassWordMatch = await user.comparePassword(password);
                
                if (isPassWordMatch) {
                    //create JWT.
                    const payload = {username: username};
                    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h"});
                    const response = {
                        message: "Login successful.",
                        token: token
                    };

                    //Inform the user has been logged in and return.
                    res.status(200).json(response);
                    return;
                } else {
                    //If password is not correct create error message.
                    error.message = "Information missing!";
                    error.details = "Log in requires correct username and a password.";
                    error.https_response.message = "Unauthorized!";
                    error.https_response.code = 401;

                    //Sen error-message and return.
                    res.status(401).json(error);
                    return;
                }
            }
        }
    } catch (err) {
        //If something goes wrong.
        error.message = "Something went wrong!";
        error.details = err;
        error.https_response.message = "Internal server error.";
        error.https_response.code = 500;

        //Send error message.
        res.status(500).json(error);
        return;
    }
});

//Get protected pages
router.get("/protected", authenticateToken, async (req, res) => {
    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {
            message: "",
            code: 0
        }
    };

    //Try-catch to fetch protected pages.
    try {
        //Fetch information (currently just a string of example function).
        let result = "await Data.find({})";

        //if there are no results, show 404.
        if(result.length === 0) {
            //Create error message.
            error.message = "Not found!";
            error.details = "No data could be found.";
            error.https_response.message = "Not found";
            error.https_response.code = 404;

            //Send error message and return.
            res.status(404).json(error);
            return;
        } else {
            //Otherwise, show results.
            res.status(200).json(result);
            return;
        }
    } catch (err) {
        //If something goes wrong.
        error.message = "Something went wrong!";
        error.details = err;
        error.https_response.message = "Internal server error.";
        error.https_response.code = 500;

        //Send error message.
        res.status(500).json(error);
    }
});

//Function for authenticating JWT.
function authenticateToken(req, res, next) {
    //Variables
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //Object for errors.
    let error = {
        message: "",
        details: "",
        https_response: {
            message: "",
            code: 0
        }
    };

    //Check if token exists.
    if(token === null) {
        //Create error message.
        error.message ="Unauthorized!";
        error.details = "User was not authorized.";
        error.https_response.message = "Unauthorized";
        error.https_response.code = 401;
        
        //Send error message and return.
        res.status(401).json(error);
        return;
    } else {
        //Verify JWT.
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {

            //If there's an error.
            if(err){
                //Create error message.
                error.message ="Forbidden!";
                error.details = "The token was incorrect.";
                error.https_response.message = "Forbidden";
                error.https_response.code = 403;
                
                //Send error message and return.
                res.status(403).json(error);
                return;
            } else {
                //If JWT is verified.
                req.username = username;
                next();
            }
        })
    }
};

//Route not found.
router.all("*", (req, res) => {
    res.status(404).json({message: "Route not found"});
});

//Export
module.exports = router;