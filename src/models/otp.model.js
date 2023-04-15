'use strict'

const mongoose = require('mongoose');

const COLLECTION_NAME = 'Otp';
const DOCUMENT_NAME = 'Otps';

var otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    wrongs: { type: Number, default: 0 },
    time: { type: Date, default: Date.now, index: {expires: 60*5}}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

module.exports = mongoose.model(DOCUMENT_NAME, otpSchema);