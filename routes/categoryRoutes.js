/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

//CRUD for food-categories, mainly for admin purposes.
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
    console.log("Connected to database");
});

//All routes.
//Get all categories.
router.get("/all", (req, res) => {
    connection.query(`SELECT category_id, name, description FROM menu_category;`, (err, result) => {
        //If-else to handle errors.
        if(err) {
            res.status(500).json({error: "Something went wrong."});
            return;
        } else if(result.length === 0){
            res.status(404).json({message: "No categories found."});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Get category on id.
router.get("/:id", (req, res) => {
    let id = req.params.id;

    //Get the category with category_id=id.
    connection.query(`SELECT name, description FROM menu_category WHERE category_id=?;`, id, (err, result) => {
        //If-else to handle errors and result.
        if(err) {
            res.status(500).json({error: "Something went wrong."});
            return;
        } else if(result.length === 0) {
            res.status(494).json({messaage: `No categories with id ${id} exist.`});
            return;
        } else {
            res.status(200).json(result);
        }
    });
});

//Create category
router.post("/", (req, res) => {
    //Variables from body.
    const name = req.body.name;
    const description = req.body.description;

    let error = {
        message: "",
        details: "",
        https_response: {}
    };

    if(!name || !description) {
        //Error messages and response code.
        error.message = "Information not included in request!";
        error.details = "Adding a category requires name and description, one or both is missing.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(name.length < 4 || name.length > 32) {
        //Error messages and response code.
        error.message = "Incorrect information!";
        error.details = "Name of category must be between 4-32 characters.";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else if(description.length > 128) {
        //Error messages and response code.
        error.message = "Incorrect information!";
        error.details = "Description of category can't be over 128 characters..";
        error.https_response.message = "Bad request";
        error.https_response.code = 400;

        //Send error message and return.
        res.status(400).json(error);
        return;
    } else {
        //If alla data seem correct, create category.
        connection.query(`INSERT INTO menu_category VALUES (?, ?, ?);`, [null, name, description], (err, result) => {
            //Error-handling.
            if(err) {
                res.status(500).json({error: "Something went wrong."});
                return;                
            } else {
                //Create object.
                let category = {
                    name: name,
                    description: description
                }
                //Show message.
                res.status(201).json({message: "Category created: ", category});
            }
        });
    }
});

//Update category per id.
router.put("/:id", (req, res) => {
        //Variables from body and URL.
        const category_id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
    
        let error = {
            message: "",
            details: "",
            https_response: {}
        };
    
        if(!category_id || !name || !description) {
            //Error messages and response code.
            error.message = "Information not included in request!";
            error.details = "Updating a category requires category id, name and description, one or more is missing.";
            error.https_response.message = "Bad request";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else if(category_id.length > 11 || category_id < 1){
            //Error messages and response code.
            error.message = "Incorrect information!";
            error.details = "Category id must be a number over 1 and can't be more than 11 characters in length..";
            error.https_response.message = "Bad request";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else if(name.length < 4 || name.length > 32) {
            //Error messages and response code.
            error.message = "Incorrect information!";
            error.details = "Name of category must be between 4-32 characters.";
            error.https_response.message = "Bad request";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else if(description.length > 128) {
            //Error messages and response code.
            error.message = "Incorrect information!";
            error.details = "Description of category can't be over 128 characters..";
            error.https_response.message = "Bad request";
            error.https_response.code = 400;
    
            //Send error message and return.
            res.status(400).json(error);
            return;
        } else {
            //If alla data seem correct, create category.
            connection.query(`UPDATE menu_category SET name = ?, description = ? WHERE category_id=?;`, [name, description, category_id], (err, result) => {
                //Error-handling.
                if(err) {
                    res.status(500).json({error: "Something went wrong."});
                    return;                
                } else {
                    //Create object.
                    let category = {
                        category_id: category_id,
                        name: name,
                        description: description
                    }
                    //Show message.
                    res.status(201).json({message: "Category updated: ", category});
                }
            });
        }
});

//Delete category.
router.delete("/delete/:id", (req, res) => {
    let id = req.params.id;
    
    connection.query(`DELETE FROM menu_category WHERE category_id=?;`, id, (err, result) => {
        //If-else for errorhandling.
        if(err) {
          //Send error message and return.
          res.status(500).json({error: "Something went wrong."});
          return;   
        } else {
            //Response.
            res.status(200).json({message: `Category with id ${id} deleted.`});
        }
    });
});

//Route not found.
router.all("*", (req, res) => {
    res.status(404).json({message: "Route not found."});
});

//Export
module.exports = router;