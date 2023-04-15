'use strict'

const JWT = require('jsonwebtoken');
const createError = require('http-errors');
// connect redis
const { client } = require('../database/init.redis');

const verifyAccessToken = async (req, res, next) => {
    try {
        // get authorization header
        const authHeader = req.headers["authorization"];
        if (!authHeader) return next(createError.Forbidden('You need sign in!'))
        // get access token
        const accessToken = authHeader.split(' ')[1];
        if (!accessToken) return next(createError.BadRequest('No token!'))
        // verify access token
        JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN, (err, decoded) => {
            if(err) {
                if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized())
                return next(createError.Unauthorized(err.message))
            }
            req.user_id = decoded.id;
            next()
        })
    } catch (error) {
        next(error);
    }
}

const verifyRefreshToken = async (req, res, next) => {
    try {
        // get refresh token
        const { refreshToken } = req.body;
        if (!refreshToken) return next(createError.BadRequest())

        // veirfy refresh token
        JWT.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized())
                return next(createError.Unauthorized(err.message));
            }

            client.commandQueueLength(decoded.id, (err, reply) => {
                if (err) return next(createError.InternalServerError())
                if (refreshToken !== reply) return next(createError.Unauthorized())
                req.payload = decoded;
                next();
            })
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    verifyAccessToken,
    verifyRefreshToken
}