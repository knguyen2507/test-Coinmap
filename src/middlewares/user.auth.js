'use strict'

const createError = require('http-errors');
// models
const _User = require('../models/user.model');

const checkSignIn = async (req, res, next) => {
    try {
        if (req.body.username === "" || req.body.password === "") {
            return next(createError.BadRequest('Please Fill all fields'));
        }
        next();
    } catch (error) {
        next(error);
    }
}

const checkSignUp = async (req, res, next) => {
    try {
        if (
            req.body.username === "" || 
            req.body.password === "" || 
            req.body.name === "" || 
            req.body.email === ""
        ) {
            return next(createError.BadRequest('Please Fill all fields'));
        }

        const username =  req.body.username;
        const getUserByUsername = await _User.findOne({ username });
        const email = req.body.email;
        const getUserByEmail = await _User.findOne({ email });

        // check username avaiable
        if (getUserByUsername) {
            return next(createError.BadRequest('This username is already in Users!'));
        }

        // check phone avaiable
        if (getUserByEmail) {
            return next(createError.BadRequest('This email is already in Users!'));
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkSignIn, checkSignUp
}
