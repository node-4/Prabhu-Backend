const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  phone: {
    type: String,
    require: false,
    default: "",
  },
  google_id: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  otpVerification: {
    type: Boolean,
    default: false,
  },
  otpExpire: {
    type: Date,
  },
  profileImage: {
    type: String,
    default: "https://static.vecteezy.com/system/resources/thumbnails/008/154/360/small/student-logo-vector.jpg",
  },
  latitude: {
    type: String,
    default: "",
  },
  longitude: {
    type: String,
    default: "",
  },
  pinCode: {
    type: String,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  userName: {
    type: String,
    default: "",
  },
  userType: {
    type: String,
    enum: ["INSTRUCTOR", "USER", "ACCOUNT MANAGER"],
    default: "USER"
  },
  photo: {
    type: String,
    default:
      "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
  },
});

const userModel = mongoose.model("userProfile", userSchema);
module.exports = userModel;
