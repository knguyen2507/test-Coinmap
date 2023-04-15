'use strict'

const JWT = require('jsonwebtoken');
const createError = require('http-errors');
// connect redis
const { client } = require('../database/init.redis');


// create access token
const signAccessToken = async (id) => {
    return new Promise ((resolve, reject) => {
        const payload = { id };
        const secret = process.env.SECRET_ACCESS_TOKEN;
        const options = { expiresIn: '30s' };

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
};

const signRefreshToken = async(id) => {
    return new Promise ((resolve, reject) => {
        const payload = { id };
        const secret = process.env.SECRET_REFRESH_TOKEN;
        const options = { expiresIn: '1y' };

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) reject(err)

            client.set(payload.id.toString(), token, 'EX', 365*24*60*60, (err, reply) => {
                if (err) reject(createError.InternalServerError())
                resolve(token)
            })
        })
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken
}