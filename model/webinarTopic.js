const mongoose = require('mongoose');
const courses = mongoose.Schema({
        user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
        },
        title: {
                type: String,
        },
        content: {
                type: String
        },
        status: {
                type: String,
                enum: ["Approved", "Disapproved", "Pending"],
                default: "Pending"
        },

})
const course = mongoose.model('webinarTopic', courses);
module.exports = course