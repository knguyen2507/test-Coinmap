'use strict'

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
// Model
const _User = require('../models/user.model');

dotenv.config();

const connectString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// connect mongodb
mongoose
.connect(connectString, { maxPoolSize: 50 })
.then( _ => console.log('Connected mongoose success!...'))
.catch(err => console.error(`Error: connect::`, err));

// all executed methods log output to console
mongoose.set('debug', true);

// disable colors in debug mode
mongoose.set('debug', { color: false });

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true });

const db = mongoose.connection;

_User.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
        const pw001 = await bcrypt.hash('Test001', 10);
        const pw002 = await bcrypt.hash('Test002', 10);
        const pw003 = await bcrypt.hash('Test003', 10);
        
        new _User({
            name: 'test 001',
            username: 'test001',
            password: pw001,
            email: 'test001@gmail.com'
        }).save(err => {
            if (err) {
              console.log("error", err);
            }
            console.log("added 'test 001' to Users collection");
        });

        new _User({
            name: 'test 002',
            username: 'test002',
            password: pw002,
            email: 'test002@gmail.com'
        }).save(err => {
            if (err) {
              console.log("error", err);
            }
            console.log("added 'test 002' to Users collection");
        });

        new _User({
            name: 'test 003',
            username: 'test003',
            password: pw003,
            email: 'test003@gmail.com'
        }).save(err => {
            if (err) {
              console.log("error", err);
            }
            console.log("added 'test 003' to Users collection");
        });
    }
});

module.exports = {db};