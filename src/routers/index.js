'use strict'

const express = require('express');
// controllers
const {
    signIn, signUp, verifyOtp, refreshToken
} = require('../controllers');
// middlewares
const { checkSignIn, checkSignUp } = require('../middlewares/user.auth');
const { verifyRefreshToken } = require('../middlewares/jwt.auth');

const router = express.Router();

router.post('/sign-in', checkSignIn, signIn);
router.post('/sign-up', checkSignUp, signUp);
router.post('/verify-otp', verifyOtp);
router.post('/refresh-token', verifyRefreshToken, refreshToken);

module.exports = { router };