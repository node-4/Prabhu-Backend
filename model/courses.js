const mongoose = require('mongoose');
const courses = mongoose.Schema({
        user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
        },
        webinarTopicId: {
                type: mongoose.Schema.ObjectId,
                ref: "webinarTopic",
        },
        title: {
                type: String,
        },
        image: {
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
                enum: ["Draft", "unDraft"]
        },
        visibilty: {
                type: String,
                enum: ["Public", "Private"]
        },
        publish: {
                type: String,
                enum: ["Immediately", "Not Immediately"]
        },
})
const course = mongoose.model('courses', courses);
module.exports = course