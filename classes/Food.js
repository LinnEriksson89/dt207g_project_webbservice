/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

//Food-class.
class Food {
    //Constructor
    constructor(category_id, name, price, description, allergens){
        this.category_id = category_id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.allergens = allergens;
    }

    //Calculate ID for weekly menu.
    calculateWeekID() {
        //Calculate week_id (in format: YearMonthDay of Monday of the week)
        const today = new Date();
        const weekday = today.getDay();
        let monday = new Date();

        //If-else, create new date for monday if it isn't monday.
        if(weekday != 1){
            
            if(weekday === 0){
                //If it's sunday we need to do -6
                monday.setDate(today.getDate() - 6);
            } else {
                //For all other days take "weekday - 1" as that's how many days we need to go back.
                let calMonday = weekday - 1;

                //Set date of monday as today - number of steps back with weekday
                monday.setDate(today.getDate() - calMonday);
            }
        } else {
            monday = today;
        }

        //Get year, month and date from last monday.
        let year = monday.getFullYear();
        let month = monday.getMonth() + 1; //getMonth() returns 0-11.
        let date = monday.getDate();
        let monthString = "00";
        let dateString = "00";

        //Turn month into a string, and if it's 1-9 add a zero before it.
        if(month < 10) {
            monthString = "0" + month.toString();
        } else {
            monthString = month.toString();
        }

        //Turn date into a string, and if it's 1-9 add a zero before it.
        if (date < 10) {
            dateString = "0" + date.toString();
        } else {
            dateString = date.toString();
        }
        
        //Create weekId in form of a string that looks like "20240902" and return it.
        let weekId = year.toString() + monthString + dateString;
        return weekId;
    }

    //Make the weekly menu.
    calculateWeeklyMenu(weekID) {
        //Variables and dependecies.
        let lunches = [];
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

        //Start by checking if a menu already exists and the user just messed up the id.
        connection.query(`SELECT menu_list FROM week_menu WHERE week_id=?;`, weekID, (err, result) => {
            if(err) {    
                //Send error message and return.
                return err;
            } else if (result) {
                //Return correct menu anyway.
                return result;
            }
            //If none of the above is true the code continues and calculates the menu.
        });
        
        //Get all items from the lunch-category.
        connection.query(`SELECT item_id, name, description, allergens, lunchday, lunchprio FROM lunch_item ORDER BY lunchprio, lunchday, item_id;`, (err, result) => {
            //If-else for error handling and result.
            if(err) {
              //Error message, http response code and return.
              return json({status: 500, error: "Something went wrong."});
            } else {
                //Loop through results and add all with lunchprio=1 to lunches.
                result.forEach(item => {
                    if(item.lunchprio === 1) {
                        lunches.push(item);
                    }
                });

                //Are there enough items? Otherwise we need to push prio=2 too.
                if(lunches.length < 14) {
                    result.forEach(item => {
                        if(item.lunchprio === 2) {
                            lunches.push(item);
                        }
                    });
                }

                //Are there enough items? Otherwise we need to push prio=3 too.
                if(lunches.length < 14) {
                    result.forEach(item => {
                        if(item.lunchprio === 3) {
                            lunches.push(item);
                        }
                    });
                }
            }

            //Lunches should now be an array with at least 14 items.
            //Remove items to get exactly 14 items in array.
            while(lunches.length > 14) {
                lunches.pop();
            }

            //Create a new array with 14 items and a copy of lunches.
            const weeklymenu = new Array(14);
            let lunchesCopy = lunches.slice(0);

            //Use a for loop with if/else-statetments to add to weeklyMenu according to lunchdays.
            //The idea is that Monday is weeklyMenu[0] and weeklyMenu[1], Tuesday is [2] and [3] and so on.
            //This is probably not the best way to do this, but I learned alot about slice and splice to get it to work.
            let i = 0;
            lunches.forEach(lunch => {
                if(lunch.lunchday == 1){
                    if(!weeklymenu[0]) {
                        weeklymenu[0] = lunch;
                    } else if(!weeklymenu[1]) {
                        weeklymenu[1] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 2){
                    if(!weeklymenu[2]) {
                        weeklymenu[2] = lunch;
                    } else if(!weeklymenu[3]) {
                        weeklymenu[3] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 3){
                    if(!weeklymenu[4]) {
                        weeklymenu[4] = lunch;
                    } else if(!weeklymenu[5]) {
                        weeklymenu[5] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 4){
                    if(!weeklymenu[6]) {
                        weeklymenu[6] = lunch;
                    } else if(!weeklymenu[7]) {
                        weeklymenu[7] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 5){
                    if(!weeklymenu[8]) {
                        weeklymenu[8] = lunch;
                    } else if(!weeklymenu[9]) {
                        weeklymenu[9] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 6){
                    if(!weeklymenu[10]) {
                        weeklymenu[10] = lunch;
                    } else if(!weeklymenu[11]) {
                        weeklymenu [11] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                } else if(lunch.lunchday == 7){
                    if(!weeklymenu[12]) {
                        weeklymenu[12] = lunch;
                    } else if(!weeklymenu[13]) {
                        weeklymenu[13] = lunch;
                    }
                    lunchesCopy.splice(i, 1);
                    i--;
                }
                i++;
            });

            //Now weeklymenu is an array with some days filled, these are the "important to be on specific weekdays"-lunches.
            //Also "lunchesCopy" is an array of the remaining lunches were lunchday is set to 0.
            //With a for on the weeklymenu we're adding in the remaining lunches.
            
            //Variable for lunchesCopy[j] as this will not match the index of weeklymenu..
            let j = 0;

            for (let i = 0; i < weeklymenu.length; i++) {
                const menuitem = weeklymenu[i];

                //If the item doesn't exist or is undefined.
                if(!menuitem || menuitem === undefined || menuitem === null){
                    weeklymenu[i] = lunchesCopy[j];
                    j++;
                }  
            };

            //Now weeklymenu should be an array of 14 items with lunches that are marked as specific days on those days.
            const menu = JSON.stringify(weeklymenu);

            //Create query and send to database.
            connection.query(`INSERT INTO week_menu VALUES (?, ?);`, [weekID, menu], (err, result) => {
                //Error-handling with if-else.
                if(err) {
                    //Send error message and return.
                    return err;
                } else {
                    //Finally the lunchprio of everything needs to be lowerd to 3 so the same lunches aren't repeated the next week.
                    weeklymenu.forEach(item => {
                        let id = item.item_id;

                        connection.query(`UPDATE lunch_item SET lunchprio = 3 WHERE item_id = ?;`, id, (err, result) => {
                            //Error-handling with if.
                            if(err) {
                                //Send error message and return.
                                return err;
                            } else {
                                //Post successmessage.
                                console.log(`Lunchitem with id: ${id} was updated with lower priority for comming weeks.`);
                            }
                        });
                    });
                    //Show success message.
                    console.log(`Weekly menu with id: ${weekID} was added.`, weeklymenu);
                }
            });            
        });
    }
}

//Export
module.exports = Food;