const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../configs/auth.config");
var newOTP = require("otp-generators");
const User = require("../model/user");
const helpandSupport = require('../model/helpAndSupport');
const webinarTopic = require('../model/webinarTopic');
const industryCategory = require('../model/industryCategory');
const industrySubcategory = require('../model/industrySubcategory');

exports.registration = async (req, res) => {
        const { phone, email } = req.body;
        try {
                req.body.email = email.split(" ").join("").toLowerCase();
                let user = await User.findOne({ $and: [{ $or: [{ email: req.body.email }, { phone: phone }] }], userType: "ADMIN" });
                if (!user) {
                        if (req.body.password == req.body.confirmPassword) {
                                req.body.password = bcrypt.hashSync(req.body.password, 8);
                                req.body.userType = "ADMIN";
                                const userCreate = await User.create(req.body);
                                res.status(200).send({ status: 200, message: "registered successfully ", data: userCreate, });
                        } else {
                                res.status(201).send({ status: 201, message: "Password not matched", data: [] });
                        }
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
                const user = await User.findOne({ email: email, userType: "ADMIN" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                }
                const isValidPassword = bcrypt.compareSync(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ status: 401, message: "Wrong password" });
                }
                const accessToken = jwt.sign({ id: user._id }, authConfig.secret, { expiresIn: authConfig.accessTokenTime, });
                let obj = {
                        _id: user._id,
                        phone: user.phone,
                        otpVerification: user.otpVerification,
                        accessToken: accessToken
                }
                res.status(200).send({ status: 200, message: "logged in successfully", data: obj });
        } catch (error) {
                console.error(error);
                res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.getProfile = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
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
exports.AddIndustryCategory = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const obj = {
                                title: req.body.title,
                        }
                        const Data = await industryCategory.create(obj);
                        res.status(200).json({ status: 200, message: "Industry category created successfully.", data: Data })
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (err) {
                console.log(err);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllIndustryCategory = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const Data = await industryCategory.find({});
                        if (Data.length == 0) {
                                return res.status(404).json({ status: 404, message: "Industry category data not found", data: {} });
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
exports.getIndustryCategorybyId = async (req, res) => {
        try {
                const data = await industryCategory.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteIndustryCategory = async (req, res) => {
        try {
                const data = await industryCategory.findById(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        const updated = await industryCategory.findByIdAndDelete({ _id: data._id });
                        return res.status(200).json({ status: 200, message: "Industry Category  delete successfully.", data: data });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.AddIndustrySubcategory = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const datas = await industryCategory.findById(req.body.industryCategory);
                        if (!datas || datas.length === 0) {
                                return res.status(404).json({ status: 404, message: "No data found", data: {} });
                        }
                        const obj = {
                                industryCategory: datas._id,
                                title: req.body.title,
                        }
                        const Data = await industrySubcategory.create(obj);
                        res.status(200).json({ status: 200, message: "Industry category created successfully.", data: Data })
                } else {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
        } catch (err) {
                console.log(err);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllIndustrySubcategory = async (req, res) => {
        try {
                const Data = await industrySubcategory.find({ industryCategory: req.params.industryCategory });
                if (Data.length == 0) {
                        return res.status(404).json({ status: 404, message: "Industry category data not found", data: {} });
                } else {
                        res.status(200).json({ status: 200, message: "Data found successfully.", data: Data })
                }
        } catch (err) {
                console.log(err);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getIndustrySubcategorybyId = async (req, res) => {
        try {
                const data = await industrySubcategory.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found successfully.", data: data });
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteIndustrySubcategory = async (req, res) => {
        try {
                const data = await industrySubcategory.findById(req.params.id);
                if (!data) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        const updated = await industrySubcategory.findByIdAndDelete({ _id: data._id });
                        return res.status(200).json({ status: 200, message: "Industry Category  delete successfully.", data: data });
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllPendingWebinarTopic = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const Data = await webinarTopic.find({ status: "Pending" });
                        if (data.length == 0) {
                                return res.status(404).json({ status: 404, message: "webinarTopic data not found", data: {} });
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
exports.getAllAcceptWebinarTopic = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const Data = await webinarTopic.find({ status: "Approved" });
                        if (data.length == 0) {
                                return res.status(404).json({ status: 404, message: "webinarTopic data not found", data: {} });
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
exports.getAllRejectWebinarTopic = async (req, res) => {
        try {
                const data = await User.findOne({ _id: req.user._id, });
                if (data) {
                        const Data = await webinarTopic.find({ status: "Disapproved" });
                        if (data.length == 0) {
                                return res.status(404).json({ status: 404, message: "webinarTopic data not found", data: {} });
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
exports.updateWebinarTopicbyId = async (req, res) => {
        try {
                const data = await webinarTopic.findById(req.params.id);
                if (!data || data.length === 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                } else {
                        if (req.body.status == "Approved") {
                                const updated = await webinarTopic.findOneAndUpdate({ _id: data._id }, { $set: { status: req.body.status } }, { new: true });
                                return res.status(200).json({ status: 200, message: "Approved update found successfully.", data: updated });
                        }
                        if (req.body.status == "Disapproved") {
                                const updated = await webinarTopic.findOneAndUpdate({ _id: data._id }, { $set: { status: req.body.status } }, { new: true });
                                return res.status(200).json({ status: 200, message: "Disapproved update found successfully.", data: updated });
                        }
                        if (req.body.status == "Pending") {
                                const updated = await webinarTopic.findOneAndUpdate({ _id: data._id }, { $set: { status: req.body.status } }, { new: true });
                                return res.status(200).json({ status: 200, message: "Pending update found successfully.", data: updated });
                        }
                }
        } catch (error) {
                console.log(error);
                res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};