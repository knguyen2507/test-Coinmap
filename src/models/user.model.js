'use strict'

// !dmbg
const mongoose = require('mongoose'); // Erase if already required

const COLLECTION_NAME = 'User';
const DOCUMENT_NAME = 'Users';

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);