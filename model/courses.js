const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const courses = mongoose.Schema({
        user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
        },
        webinarTopicId: {
                type: mongoose.Schema.ObjectId,
                ref: "webinarTopic",
        },
        industryCategoryId: {
                type: mongoose.Schema.ObjectId,
                ref: "industryCategory",
        },
        industrySubcategoryId: {
                type: mongoose.Schema.ObjectId,
                ref: "industrySubcategory",
        },
        title: {
                type: String,
        },
        image: {
                type: String,
        },
        date: {
                type: Date
        },
        time: {
                type: String
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

courses.plugin(mongoosePaginate);
courses.plugin(mongooseAggregatePaginate);
const course = mongoose.model('courses', courses);
module.exports = course