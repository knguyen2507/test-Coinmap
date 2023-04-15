'use strict'

const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_URI
});

client.ping(function (err, result) {
    console.log(result);
});

client.on("error", (error) => {
    console.error(error);
});

client.on('connect', (error) => {
    console.log('Redis client connected');
});

client.on("ready", (error) => {
    console.error('Redis to ready');
});

module.exports = { client };