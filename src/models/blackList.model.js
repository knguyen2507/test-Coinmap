'use strict'

const mongoose = require('mongoose');

const COLLECTION_NAME = 'BlackList';
const DOCUMENT_NAME = 'Blacklist';

var blackListSchema = new mongoose.Schema({
    email: String,
    time: { type: Date, default: Date.now, index: {expires: 30*24*60*60}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, blackListSchema);