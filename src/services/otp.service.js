'use strict'

const bcrypt = require('bcrypt');
// models
const _Otp = require('../models/otp.model');

const insertOtp = async ({otp, email}) => {
    try {
        const hashOtp = await bcrypt.hash(otp, 10);
        const Otp = await _Otp.create({
            email, otp: hashOtp
        });

        return Otp ? 1 : 0
    } catch (error) {
        console.log(error);
    }
}

const validOtp = async ({otp, hashOtp}) => {
    try {
        const isValid = await bcrypt.compare(otp, hashOtp);
        return isValid;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { insertOtp, validOtp }