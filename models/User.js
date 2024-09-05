/* DT207G - Backend-baserad webbutveckling
 * Projekt
 * Linn Eriksson, VT24
 */

"use strict";

//Constants and requirements.
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//Create a schema for users.
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username required."],
        min: [4, "Username has to be at least 4 characters."],
        max: [32, "Username can not be over 32 characters."]
    },
    password: {
        type: String,
        required: [true, "Password required."],
        min: [16, "Password has to be at least 16 characters."],
        max: [128, "Password can not be over 128 characters." ]
    },
    created: {
        type: Date,
        default: Date.now
    }
});

//Hash password before saving it to DB.
userSchema.pre("save", async function(next) {
    try {
        //If it's a new user or the password is modified.
        if(this.isNew || this.isModified("password")) {
            //Let bcrypt hash the password and save the hashedPassword as password.
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        next(error);
    }
});

//Register user.
userSchema.statics.register = async function(username, password) {
    try {
        const user = new this({username, password});
        const previousUser = await this.findOne({username});

        //Check if username already exists by checking if previousUser is empty.
        if(!previousUser) {
            await user.save();
            return user;
        } else {
            //If previousUser is not empty, it's because that name is in use already.
            throw new Error("Username already in use!");
        }
    } catch (error) {
        throw error;
    }
};

//Compare hashed password.
userSchema.methods.comparePassword = async function(password) {
    try {
        //Let bcrypt compare the stored password against the tested password.
        const comparedPassword = await bcrypt.compare(password, this.password);

        //Return result. (should be true or false)
        return comparedPassword;
    } catch (error) {
        throw error;
    }
};

//Login user.
userSchema.statics.login = async function(username, password){
    try {
        //Get user from DB.
        const user = await this.findOne({username});

        //If there is no user with that username, throw error.
        if(!user) {
            //Intentionally vague error as to not let hackers know if username exists or not.
            throw new Error("Incorrect username and/or password!");
        } else {
            //If user exists, check password.
            const isPasswordMatch = await user.comparePassword(password);

            //If password is incorrect, throw error.
            if(!isPasswordMatch){
                //Intentionally vague error as to not let hackers know if username exists or not.
                throw new Error("Incorrect username and/or password!");
            } else if(isPasswordMatch) {
                //If password is correct return user.
                return user;
            } else {
                //Shouldn't be possible to end up here, but feels wrong to not end on a else.
                throw new Error("Something went wrong, sorry!");
            }
        }

    } catch (error) {
        throw error;   
    }
};

//Create and export model.
const User = mongoose.model("User", userSchema);
module.exports = User;