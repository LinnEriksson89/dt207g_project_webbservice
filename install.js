/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

//Install script for food-tables.
//Variables and required.
const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.FOOD_DBHOST,
    user: process.env.FOOD_DBUSERNAME,
    password: process.env.FOOD_DBPASSWORD,
    database: process.env.FOOD_DBDATABASE
});

//Drop tables.
connection.promise().query("DROP TABLE IF EXISTS menu_item, menu_category, week_menu;")
.then(console.log("Tables dropped!"));

//Create tables.
connection.promise().query(`CREATE TABLE menu_category (
    category_id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    description VARCHAR(128),
    PRIMARY KEY (category_id)
    );`
).then(console.log("Table 'menu_category' created!"));

connection.promise().query(`CREATE TABLE menu_item (
    item_id INT(11) NOT NULL AUTO_INCREMENT,
    category_id INT(11) NOT NULL,
    name VARCHAR(32) NOT NULL,
    price DOUBLE(5,2) NOT NULL,
    description VARCHAR(128),
    allergens VARCHAR(256),
    lunchday INT(1) NOT NULL,
    lunchprio INT(1) NOT NULL,
    PRIMARY KEY (item_id),
    FOREIGN KEY (category_id) REFERENCES menu_category(category_id)
    );`
).then(console.log("Table 'menu_item' created!"));

connection.promise().query(`CREATE TABLE week_menu (
    week_id int(6) NOT NULL,
    menu_list JSON,
    PRIMARY KEY (week_id)
    );`
).then(console.log("Table 'week_menu' created!"));

//Close connection.
connection.end();