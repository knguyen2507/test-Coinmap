'use strict'

const bcrypt = require('bcrypt');
const OtpGenerator = require('otp-generator');
// models
const _User = require('../models/user.model');
const _Otp = require('../models/otp.model');
const _BlackList = require('../models/blackList.model');
// utils
const { getInfoData } = require('../utils');
// services
const { signAccessToken, signRefreshToken } = require('./jwt.service');
const { insertOtp, validOtp } = require('./otp.service');

const sign_in = async({ username, password }) => {
    try {
        // find user in database
        const user = await _User.findOne({username});
        if (!user) {
            return {
                code: 403,
                message: "Wrong username or password"
            }
        }
        // check password is valid
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return {
                code: 403,
                message: "Wrong username or password"
            }
        }
        // get token
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);

        return {
            code: 200,
            metadata: {
                user: getInfoData({
                    fields: ['_id', 'name'],
                    object: user
                }),
                accessToken: accessToken,
                refreshToken: refreshToken
            },
            message: `${user.name} Login Successfully`
        }
    } catch (error) {
        console.log(error);
    }
};

const sign_up = async ({email}) => {
    try {
        // check email in blacklist
        const checkEmail = await _BlackList.findOne({email});
        if (checkEmail) {
            return {
                code: 400,
                message: "email in Blacklist"
            }
        }
        // check limit OTP generate
        const listOtp = await _Otp.find({email});
        if (listOtp.length > 2) {
            if (Date.now() - listOtp[listOtp.length - 3].createdAt < 60^1000 || listOtp.length > 4) {
                // deleteMany Otp in Data
                await _Otp.deleteMany({ email });
                await _BlackList.create({ email });

                return {
                    code: 429,
                    message: "over limit sending otp"
                }
            }
        }

        // generate otp
        const otp = OtpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        console.log(`Otp::`, otp);

        const insert_otp = await insertOtp({
            otp, email
        })

        return {
            code: 200,
            metadata: {
                otp: insert_otp
            }
        }
        
    } catch (error) {
        console.log(error);
    }
};

const verify_otp = async ({otp, name, username, password, email}) => {
    try {
        const hashPw = await bcrypt.hash(password, 10);
        const newUser = {
            name, username, password: hashPw, email
        };
        // check email in Otps
        const listOtp = await _Otp.find({email});
        if (!listOtp.length) {
            return {
                code: 404,
                message: 'Expired OTP!'
            }
        }

        // get last otp
        const lastOtp = listOtp[listOtp.length - 1];
        // check otp is valid
        const isValid = await validOtp({otp, hashOtp: lastOtp.otp});
        if (!isValid) {
            if (lastOtp.wrongs > 2) {
                await _BlackList.create({ email });
                // deleteMany Otp in Data
                await _Otp.deleteMany({ email });
                return {
                    code: 429,
                    message: "over limit entering otp"
                }
            }
            // count the number of wrong entering otp
            await _Otp.updateOne({otp: lastOtp.otp}, {$set:{wrongs: lastOtp.wrongs+1}});
            return {
                code: 401,
                message: 'Invalid Otp!'
            }
        } 
        if (isValid && email === lastOtp.email) {
            // create user
            const user = await _User.create(newUser);
            if (user) {
                // deleteMany Otp in Data
                await _Otp.deleteMany({ email });
            }

            return {
                code: 201,
                message: "Your account has been successfully created",
                metadata: {
                    user
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = { sign_in, sign_up, verify_otp };