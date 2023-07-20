const mongoose = require('mongoose');
const courses = mongoose.Schema({
        title: {
                type: String,
        },
        status: {
                type: String,
                enum: ["Active", "Block"],
                default: "Active"
        },

})
const course = mongoose.model('industryCategory', courses);
module.exports = course