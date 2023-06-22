const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../models/user.model");
const helpandSupport = require('../models/helpAndSupport');
exports.registration = async (req, res) => {
        const { phone, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], userType: "INSTRUCTOR" });
                if (!user) {
                        req.body.password = bcrypt.hashSync(req.body.password, 8);
                        req.body.userType = "INSTRUCTOR";
                        const userCreate = await User.create(req.body);
                        res.status(200).send({ status: 200, message: "registered successfully ", data: userCreate, });
                } else {
                        res.status(409).send({ status: 409, message: "Already Exist", data: [] });
                }
        } catch (error) {
                console.error(error);
                res.status(500).json({ message: "Server error" });
        }
};
exports.signin = async (req, res) => {
        try {
                const { email, password } = req.body;
                const user = await User.findOne({ email: email, userType: "INSTRUCTOR" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ status: 401, message: "Wrong password" });
                }
                const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {
                        expiresIn: authConfig.accessTokenTime,
                });
                res.status(201).send({ data: user, accessToken: accessToken });
        } catch (error) {
                console.error(error);
                res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.loginWithPhone = async (req, res) => {
        try {
                const { phone } = req.body;
                const user = await User.findOne({ phone: phone, userType: "INSTRUCTOR" });
                if (!user) {
                        return res.status(400).send({ status: 400, msg: "not found" });
                }
                const userObj = {};
                userObj.otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                userObj.otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                userObj.accountVerification = false;
                const updated = await User.findOneAndUpdate({ phone: phone, userType: "INSTRUCTOR" }, userObj, { new: true, });
                res.status(200).send({ status: 200, userId: updated._id, otp: updated.otp });
        } catch (error) {
                console.error(error);
                res.status(500).json({ status: 500, message: "Server error" });
        }
};
exports.verifyOtp = async (req, res) => {
        try {
                const { otp } = req.body;
                const user = await User.findById(req.params.id);
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found" });
                }
                if (user.otp !== otp || user.otpExpiration < Date.now()) {
                        return res.status(400).json({ status: 400, message: "Invalid OTP" });
                }
                const updated = await User.findByIdAndUpdate({ _id: user._id }, { accountVerification: true }, { new: true });
                const accessToken = jwt.sign({ id: user._id }, authConfig.secret, {expiresIn: authConfig.accessTokenTime,});
                res.status(200).send({ status: 200, message: "logged in successfully", accessToken: accessToken, data: updated });
        } catch (err) {
                console.log(err.message);
                res.status(500).send({ status: 500, error: "internal server error" + err.message });
        }
};
exports.getProfile = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user.id, });
                if (data) {
                        return res.status(200).json({ status: 200, message: "get Profile", data: data });
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.resendOTP = async (req, res) => {
        const { id } = req.params;
        try {
                const user = await User.findOne({ _id: id, userType: "INSTRUCTOR" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found" });
                }
                const otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
                const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                const accountVerification = false;
                const updated = await User.findOneAndUpdate({ _id: user._id }, { otp, otpExpiration, accountVerification }, { new: true });
                res.status(200).send({ status: 200, message: "OTP resent", otp: otp });
        } catch (error) {
                console.error(error);
                res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.resetPassword = async (req, res) => {
        const { id } = req.params;
        try {
                const user = await User.findOne({ _id: id, userType: "INSTRUCTOR" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "User not found" });
                }
                if (req.body.newPassword == req.body.confirmPassword) {
                        const updated = await User.findOneAndUpdate({ _id: user._id }, { $set: { password: bcrypt.hashSync(req.body.newPassword) } }, { new: true });
                        res.status(200).send({ status: 200, message: "Password update successfully.", data: updated, });
                } else {
                        res.status(501).send({ status: 501, message: "Password Not matched.", data: {}, });
                }
        } catch (error) {
                console.error(error);
                res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.socialLogin = async (req, res) => {
        try {
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], userType: "INSTRUCTOR" });
                if (user) {
                        jwt.sign({ user_id: user._id }, JWTkey, (err, token) => {
                                if (err) {
                                        return res.status(401).json({ status: 401, msg: "Invalid Credentials" });
                                } else {
                                        return res.status(200).json({ status: 200, msg: "Login successfully", userId: user._id, token: token, });
                                }
                        });
                } else {
                        const newUser = await User.create({ firstName, lastName, mobile, email });
                        if (newUser) {
                                jwt.sign({ user_id: newUser._id }, JWTkey, (err, token) => {
                                        if (err) {
                                                return res.status(401).json({ status: 401, msg: "Invalid Credentials" });
                                        } else {
                                                return res.status(200).json({ status: 200, msg: "Login successfully", userId: user._id, token: token, });
                                        }
                                });
                        }
                }
        } catch (err) {
                return createResponse(res, 500, "Internal server error");
        }
};
exports.AddQuery = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user.id, });
                if (data) {
                        const data = {
                                user: data._id,
                                name: req.body.name,
                                email: req.body.email,
                                mobile: req.body.mobile,
                                query: req.body.query
                        }
                        const Data = await helpandSupport.create(data);
                        res.status(200).json({ status: 200, message: "Send successfully.", data: Data })
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (err) {
                console.log(err);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllQuery = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user.id, });
                if (data) {
                        const Data = await helpandSupport.find({ user: req.user._id });
                        if (data.length == 0) {
                                return res.status(404).json({ status: 404, message: "Help and support data not found", data: {} });
                        } else {
                                res.status(200).json({ status: 200, message: "Data found successfully.", data: Data })
                        }
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (err) {
                console.log(err);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};