const mongoose = require('mongoose');
const courses = mongoose.Schema({
        industryCategory: {
                type: mongoose.Schema.ObjectId,
                ref: "industryCategory",
        },
        title: {
                type: String,
        },
        status: {
                type: String,
                enum: ["Active", "Block"],
                default: "Active"
        },

})
const course = mongoose.model('industrySubcategory', courses);
module.exports = course