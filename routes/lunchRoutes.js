/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

"use strict";

//CRUD for lunch_items, for admin purposes.
//Variables and dependencies.
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

//Connect to food-database.
const connection = mysql.createConnection({
    host: process.env.FOOD_DBHOST,
    user: process.env.FOOD_DBUSERNAME,
    password: process.env.FOOD_DBPASSWORD,
    database: process.env.FOOD_DBDATABASE
});

connection.connect((_req, _res, err) => {
    if(err){
        //If there's a connection error.
        console.log("Connection failed.");
        return;
    }
    console.log("Connected to database in lunchRoutes.");
});


//All routes.
//Get all lunch-items.
router.get("/all", (req, res) => {
    connection.query(`SELECT item_id, name, description, allergens, lunchday, lunchprio FROM lunch_item;`, (err, result) => {
        //if-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong!"});
            return;            
        } else if(result.length === 0) {
            res.status(404).json({message: "No items found!"});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Get lunch-item by id.
router.get("/:id", (req, res) => {
    let id = req.params.id;
    
    connection.query(`SELECT item_id, name, description, allergens, lunchday, lunchprio FROM lunch_item WHERE item_id=?;`, id, (err, result) => {
        //if-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong!"});
            return;            
        } else if(result.length === 0) {
            res.status(404).json({message: "No item found!"});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Crete lunch-item.
router.post("/add/", (req, res) => {
    //Variables from body.
    const name = req.body.name;
    const description = req.body.description;
    const allergens = req.body.allergens;
    const lunchday = req.body.lunchday;
    const lunchprio = req.body.lunchprio;

    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    //Name can't be empty as it's the only "not null"-field that doesn't autopopulate.
    if(!name) {
        //Error messages and response code.
        error.message = "Information not included in request!";
        error.details = "Adding a lunch item requires a name.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(name.length < 4 || name.length > 32) {
        //Check that name is 4-32 chars.
        //Error message and response code for too long or short name.
        error.message = "Incorrect information!";
        error.details = "The name of the dish has to be between 4 and 32 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(description.length > 128) {
        //Check that description is maximum 128 chars.

        //Error message and response code for too long description.
        error.message = "Incorrect information!";
        error.details = "Description can't be over 128 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(allergens.length > 256) {
        //Check that allergens is max 256 chars

        //Error message and response code for too long allergens.
        error.message = "Incorrect information!";
        error.details = "Allergens can't be over 256 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(lunchday.length > 1 || lunchday < 0 || lunchday > 7) {
        //If lunchday is set to anything else than 0-7.

        //Error message and response code for too long or short lunchday.
        error.message = "Incorrect information!";
        error.details = "Lunchday has to be a number in the range of 0-7.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;

    } else if(lunchprio.length > 1 || lunchprio < 1 || lunchprio > 3) {
        //If lunchprio is set to anything else than 1-3.
        
        //Error message and response code for too long or short lunchprio.
        error.message = "Incorrect information!";
        error.details = "Lunchprio has to be set to 1, 2 or 3.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else {
        //If all data seem correct, create object.
        connection.query(`INSERT INTO lunch_item VALUES (?, ?, ?, ?, ?, ?);`, [null, name, description, allergens, lunchday, lunchprio], (err, result) => {
            //Error-handling.
            if(err) {
                //Send error message and return.
                res.status(500).json({error: "Something went wrong."});
                return;                
            } else {
                //Create lunch-item.
                let lunchItem = {
                    name: name,
                    description: description,
                    allergens: allergens,
                    lunchday: lunchday,
                    lunchprio: lunchprio
                }

                //Show message on completion:
                res.status(201).json({message: "Lunch item added: ", lunchItem});
            }
        });
    }
});

//Update lunch-item per id.
router.put("/update/:id", (req, res) => {
    //Variables from body.
    const item_id = req.params.id;
    const name = req.body.name;
    const description = req.body.description;
    const allergens = req.body.allergens;
    const lunchday = req.body.lunchday;
    const lunchprio = req.body.lunchprio;

    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    //For updating neither name or id can be empty.
    if(!item_id || !name) {
        //Error messages and response code.
        error.message = "Information not included in request!";
        error.details = "Updating a lunch requires at least a name and an id, one or more is currently missing.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(name.length < 4 || name.length > 32) {
        //Check that name is 4-32 chars.
        //Error message and response code for too long or short name.
        error.message = "Incorrect information!";
        error.details = "The name of the dish has to be between 4 and 32 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(description.length > 128) {
        //Check that description is maximum 128 chars.

        //Error message and response code for too long description.
        error.message = "Incorrect information!";
        error.details = "Description can't be over 128 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(allergens.length > 256) {
        //Check that allergens is max 256 chars

        //Error message and response code for too long allergens.
        error.message = "Incorrect information!";
        error.details = "Allergens can't be over 256 characters long.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(lunchday.length > 1 || lunchday < 0 || lunchday > 7) {
        //If lunchday is set to anything else than 0-7.

        //Error message and response code for too long or short lunchday.
        error.message = "Incorrect information!";
        error.details = "Lunchday has to be a number in the range of 0-7.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;

    } else if(lunchprio.length > 1 || lunchprio < 1 || lunchprio > 3) {
        //If lunchprio is set to anything else than 1-3.
        
        //Error message and response code for too long or short lunchprio.
        error.message = "Incorrect information!";
        error.details = "Lunchprio has to be set to 1, 2 or 3.";
        error.https_response.message = "Bad request!";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else {
        //If all data seem correct, create object.
        connection.query(`UPDATE lunch_item SET name = ?, description = ?, allergens = ?, lunchday = ?, lunchprio = ? WHERE item_id = ?;`, [name, description, allergens, lunchday, lunchprio, item_id], (err, result) => {
            //Error-handling.
            if(err) {
                //Send error message and return.
                res.status(500).json({error: "Something went wrong."});
                return;                
            } else {
                //Create lunch-item.
                let lunchItem = {
                    item_id: item_id,
                    name: name,
                    description: description,
                    allergens: allergens,
                    lunchday: lunchday,
                    lunchprio: lunchprio
                }

                //Show message on completion:
                res.status(200).json({message: "Lunch item updated: ", lunchItem});
            }
        });
    }
});

//Delete lunch-item per id.
router.delete("/delete/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`DELETE FROM lunch_item WHERE item_id=?;`, id, (err, result) => {
        if(err) {
            //Send error message and return.
            res.status(500).json({error: "Something went wrong."});
            return;     
        } else {
            //Response.
            res.status(200).json({message: `Lunch-item with id ${id} deleted.`});
        }
    });
});

//Export
module.exports = router;