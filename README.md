# Web service

Web service for project in DT207G - "Backendbaserad webbutveckling". The web service consists of a API that can be consumed with fetch from the other pages. The web service is written in JavaScript. The webservice is not published online, it is just available in this repo and can be run as a local server.

The web service is divided into four different main-parts, these are:
* /api/accounts - handles admin accounts.
* /api/food - handles the standard menu.
* /api/category - handles the categories of the standard menu.
* /api/lunch - handles lunch menu-items.

The web service has CRUD and protected parts uses JWT.

## Installation
The web service requires one SQL-database and one MongoDB-database. During development MariaDB via XAMPP and MongoDB Compass was used to run these.

Apart from that, downloading the repo and running "npm install" will install everything needed.

## Accounts

### Schema
The user accounts uses a mongoose schema. It looks like this:

|Field      |Type     |Characters |Required          |
|-----------|---------|-----------|------------------|
|_id        |ObjectID | -         |X                 |
|username   |string   | 4-32      |X                 |
|password   |string   | 16-128    |X                 |
|created    |date     | -         |Default: Date.now |

The field "_id" is automatically created in MongoDB. The field "created" has the deafult value of "now" and is not set by the user.

### Endpoints
URL used as main endpoint for this part is **/api/accounts/ and it handles everything related to accounts.

Available endpoints are:
|Metod  |URI        |Description                        |
|-------|-----------|-----------------------------------|
|POST   |/register  | Create account.                   |
|POST   |/login     | Log in.                           |
|GET    |/protected | Show data to authenticated users. |

Information is sent in JSON-format. When making fetch to /protected a Bearer token must be included. Token is recieved when log in is successful and can be used for one hour. Token should be saved in localStorage, cookie or similar for future use.

Expected body for POST is 
```json
{
    "username": "username", 
    "password": "password"
}
```

## Food

### Table
The database for food items uses MariaDB and the table has these requirements:

|Field       |Type    |Max chars |Required |Other info              |
|------------|--------|----------|---------|------------------------|
|item_id     |int     | 11       |X        |Primary key             |
|category_id |int     | 11       |X        |Foreign key             |
|name        |varchar | 32       |X        |Minimum 4 chars.        |
|price       |double  | 5        |-        |2 decimals (max 999.99) |
|description |varchar | 128      |-        | -                      |
|allergens   |varchar | 256      |-        | -                      |


### Endpoints

URL used as main endpoint for this part is **/api/food/, this endpoint handles all foods that are part of a category (aka not lunches).

Available endpoints are:
|Metod  |URI        |Description                                  |
|-------|-----------|---------------------------------------------|
|GET    |/all       | Get all food items.                         |
|GET    |/week/id   | Get weeklymenu for specified id.            |
|GET    |/cat/id    | Get all food items from specified category. |
|GET    |/id        | Get specified food item.                    |
|POST   |/add/      | Create new food item.                       |
|PUT    |/update/id | Update specified food item.                 |
|DELETE |/delete/id | Delete specified food item.                 |

Information is sent in JSON-format. 

To delete an item only the id and the correct endpoint is needed. The following body is expected for POST and PUT. Id is not needed when creating a new item as it's auto increment and added automatically.

```json
{
        "item_id": 0,
        "category_id": 0,
        "name": "Name here",
        "price": 0.99,
        "description": "Description here",
        "allergens": "Allergens here"
}
```



## Category

### Table

The database for categories uses MariaDB and the table has these requirements:

|Field       |Type    |Max chars |Required |Other info              |
|------------|--------|----------|---------|------------------------|
|category_id |int     | 11       |X        |Primary key             |
|name        |varchar | 32       |X        |Minimum 4 chars.        |
|description |varchar | 128      |-        | -                      |


### Endpoints

URL used as main endpoint for this part is **/api/category/, this endpoint handles all food categories.

Available endpoints are:
|Metod  |URI        |Description                 |
|-------|-----------|----------------------------|
|GET    |/all       | Get all categories.        |
|GET    |/id        | Get specified category.    |
|POST   |/add/      | Create new category.       |
|PUT    |/update/id | Update specified category. |
|DELETE |/delete/id | Delete specified category. |

Information is sent in JSON-format. 

To delete a category only the id and the correct endpoint is needed. The following body is expected for POST and PUT. Id is not needed when creating a new category as it's auto increment and added automatically.

```json
{
    "category_id": 0,
    "name": "Your category name here",    
    "description": "Your description here"
}
```

## Lunch

### Table

The database for lunch items uses MariaDB and the table has these requirements:

|Field       |Type    |Max chars |Required |Other info              |
|------------|--------|----------|---------|------------------------|
|item_id     |int     | 11       |X        |Primary key             |
|name        |varchar | 32       |X        |Minimum 4 chars.        |
|description |varchar | 128      |-        | -                      |
|allergens   |varchar | 256      |-        | -                      |
|lunchday    |int     | 1        |X        |Default: 0              |
|lunchprio   |int     | 1        |X        |Default: 1              |


### Endpoints

URL used as main endpoint for this part is **/api/lunch/, this endpoint handles all lunch items.

Available endpoints are:
|Metod  |URI        |Description                   |
|-------|-----------|------------------------------|
|GET    |/all       | Get all lunch items.         |
|GET    |/id        | Get specified lunch item.    |
|POST   |/add/      | Create new lunch item.       |
|PUT    |/update/id | Update specified lunch item. |
|DELETE |/delete/id | Delete specified lunch item. |

Information is sent in JSON-format. 

To delete an item only the id and the correct endpoint is needed. The following body is expected for POST and PUT. Id is not needed when creating a new item as it's auto increment and added automatically. If lunchday is left out it's default value is 0 ("any day") and if lunchprio is left out it's default is 1 ("high priority").

```json
{
    "item_id": 0,
    "name": "Name here",
    "description": "Description here",
    "allergens": "Allergens here",
    "lunchday": 0,
    "lunchprio": 1

}
```

## English
Why I decided to write this readme in English and the one for the website in Swedish? I have absolutely no idea, sorry about that. I realized this to late and I'm not going to make it a priority to make them match. As all the code comments are in English it would make sense to have the readme in English too, on the other hand the website and the associated report is in Swedish so that would have made sense too. Combining them doesn't really make sense tho, I realize that.