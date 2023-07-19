const mongoose = require("mongoose");
const objectid = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  phone: {
    type: String,
    require: false,
  },
  bio: {
    type: String,
  },
  google_id: {
    type: String,
  },
  otp: {
    type: String,
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
  },
  longitude: {
    type: String,
  },
  pinCode: {
    type: String,
  },
  firstName: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  fullName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userType: {
    type: String,
    enum: ["INSTRUCTOR", "USER", "ACCOUNT MANAGER", "BUISNESS MANAGER", "ADMIN"],
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
