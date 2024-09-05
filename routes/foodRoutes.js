/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

"use strict";

//Handles all the API-stuff for food-data.
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
    console.log("Connected to database in foodRoutes.");
});

//Food-class
const Food = require("../classes/Food");
const food = new Food(0, "", 0, "", "");

//All routes.
//Get all menu items.
router.get("/all", (req, res) => {
    connection.query(`SELECT item_id, category_id, name, price, description, allergens FROM menu_item;`, (err, result) => {
        
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

//Get weekly menu.
router.get("/week/:id", (req, res) => {
    let id = req.params.id;

    //Get weeklymenu.
    connection.query(`SELECT menu_list FROM week_menu WHERE week_id=?;`, id, (err, result) => {
        
        //if-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong!"});
            return;
        } else if(result.length === 0) {
            let currentWeekId = food.calculateWeekID();
            food.calculateWeeklyMenu(currentWeekId);
            res.status(404).json({message: "No menu existed for that, menu was created for the current week if it didn't exist."});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Get menu items per category.
router.get("/cat/:id", (req, res) => {
    let id = req.params.id;

    //Get menu-items with category_id=id.
    connection.query(`SELECT item_id, name, price, description, allergens FROM menu_item WHERE category_id=?;`, id, (err, result) => {
        //if-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong!"});
            return;            
        } else if(result.length === 0) {
            res.status(404).json({message: `No items found in category with id ${id}.`});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Get menu item per id.
router.get("/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`SELECT item_id, category_id, name, price, description, allergens FROM menu_item WHERE item_id=?;`, id,  (err, result) => {
        
        //if-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong!"});
            return;            
        } else if(result.length === 0) {
            res.status(404).json({message: `No item with item_id:${id} found.`});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Create menuitem.
router.post("/add/", (req, res) => {
    //Variables from body.
    const category_id = req.body.category_id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const allergens = req.body.allergens;

    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    //If any of the "not null"-fields are empty.
    if(!category_id || !name || !price) {
        
        //Error messages and response code.
        error.message = "Information not included in request!";
        error.details = "Adding a menu item requires category id, name, and price. One or more of these are missing.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(category_id.length > 11 || category_id < 1) {
        //If category_id is too long or lower than 1.

        //Error message and response code for too long or short category-id.
        error.message = "Incorrect information!";
        error.details = "Category id can't be more than 11 characters long and has to be 1 or higher..";
        error.https_response.message = "Bad request!";
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
    } else if(price <= 0 || price >= 1000) {
        //Check that price is 0-999.99sek

        //Error message and response code for too high or low price.
        error.message = "Incorrect information!";
        error.details = "Price has to be between 0-999.99SEK.";
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
    } else {
        //If all data seem correct, create object.
        connection.query(`INSERT INTO menu_item VALUES (?, ?, ?, ?, ?, ?);`, [null, category_id, name, price, description, allergens], (err, result) => {
            //Error-handling.
            if(err) {
                //Send error message and return.
                res.status(500).json({error: "Something went wrong."});
                return;                
            } else {
                //Create menu-item.
                let menuItem = {
                    category_id: category_id,
                    name: name,
                    price: price,
                    description: description,
                    allergens: allergens
                }

                //Show message on completion:
                res.status(201).json({message: "Menu item added: ", menuItem});
            }
        });
    }
});

//Update menuitem per id.
router.put("/update/:id", (req, res) => {
        //Variables from body and URL.
        const item_id = req.params.id;
        const category_id = req.body.category_id;
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;
        const allergens = req.body.allergens;
    
        let error = {
            message: "",
            details: "",
            https_response: {}
        };
    
        //If any of the "not null"-fields are empty.
        if(!item_id || !category_id || !name || !price) {
            
            //Error messages and response code for empty not null-fields.
            error.message = "Information not included in request!";
            error.details = "Updating a menu item requires item id, category id, name and price. One or more of these are missing.";
            error.https_response.message = "Bad request";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else if(item_id.length > 11 || item_id < 1) {
            //If item_id is too long or lower than 1.
            //Error message and response code for too long or short category-id.
            error.message = "Incorrect information!";
            error.details = "Category id can't be more than 11 characters long and has to be 1 or higher.";
            error.https_response.message = "Bad request!";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else if(category_id.length > 11 || category_id < 1) {
            //If category_id is too long or lower than 1.
    
            //Error message and response code for too long or short category-id.
            error.message = "Incorrect information!";
            error.details = "Category id can't be more than 11 characters long and has to be 1 or higher..";
            error.https_response.message = "Bad request!";
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
        } else if(price <= 0 || price >= 1000) {
            //Check that price is 0-999.99sek
    
            //Error message and response code for too high or low price.
            error.message = "Incorrect information!";
            error.details = "Price has to be between 0-999.99SEK.";
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
        } else {
            //If all data seem correct, create object.
            connection.query(`UPDATE menu_item SET category_id = ?, name = ?, price = ?, description = ?, allergens = ? WHERE item_id = ?;`, [category_id, name, price, description, allergens, item_id], (err, result) => {
                //Error-handling.
                if(err) {
                    //Send error message and return.
                    res.status(500).json({error: "Something went wrong."});
                    return;                
                } else {
                    //Create menu-item.
                    let menuItem = {
                        item_id: item_id,
                        category_id: category_id,
                        name: name,
                        price: price,
                        description: description,
                        allergens: allergens
                    }
    
                    //Show message on completion:
                    res.status(200).json({message: "Menu item updated: ", menuItem});
                }
            });
        }
});

//Delete menuitem.
router.delete("/delete/:id", (req, res) => {
    let id = req.params.id;

    connection.query(`DELETE FROM menu_item WHERE item_id=?;`, id, (err, result) => {
        if(err) {
            //Send error message and return.
            res.status(500).json({error: "Something went wrong."});
            return;     
        } else {
            //Response.
            res.status(200).json({message: `Menu-item with id ${id} deleted.`});
        }
    });
});

//Export
module.exports = router;