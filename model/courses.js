const mongoose = require('mongoose');
const courses = mongoose.Schema({
        user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
        },
        title: {
                type: String,
        },
        date: {
                type: String
        },
        time: {
                type: Number
        },
        content: {
                type: String
        },
        status: {
                type: String,
                enum: [""]
        },

})
const course = mongoose.model('courses', courses);
module.exports = course