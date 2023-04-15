'use strict'

const createError = require('http-errors');
// services
const { sign_in, sign_up, verify_otp } = require('../services');
const { signAccessToken } = require('../services/jwt.service');

// use refresh token to get access token
const refreshToken = async (req, res) => {
    const refreshToken = req.body;
    if (!refreshToken) return createError.BadRequest()

    const id = req.payload.id;
    const accessToken = await signAccessToken({ id });
    
    return res.json({
        accessToken
    })
};
// login
const signIn = async (req, res) => {
    const {username, password} = req.body;

    const {code, metadata, message} = await sign_in({username, password});

    return res.status(code).json({
        code, metadata, message
    })
};
// register
const signUp = async (req, res) => {
    const email = req.body.email;

    const {code, metadata, message} = await sign_up({ email });

    return res.status(code).json({
        code, metadata, message
    })
};
// verify otp
const verifyOtp = async (req, res) => {
    const {
        otp, name, username, password, email
    } = req.body;

    const {
        code, metadata, message
    } = await verify_otp({
        otp, name, username, password, email
    });

    return res.status(code).json({
        code, metadata, message
    });
};

module.exports = {
    signIn, signUp, verifyOtp, refreshToken
};