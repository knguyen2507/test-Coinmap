'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
// database
const { db } = require('./database/init.mongodb');
// routers
const { router } = require('./routers');

const app = express();

// init middlewares
app.use(bodyParser.json());
db;

// use router
app.use('/', router);

// handling error
app.use((req, res, next) => {
    next(createError.NotFound('This route does not exist!'));
})
app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message
    })
})

module.exports = {app};
