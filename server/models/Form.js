const mongoose = require('mongoose');
const questionSchema = require("./Question");

const formSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.ObjectId,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        lastUpdated: {
            type: Number,
            require: true
        },
        questions: [questionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false
        },
    }
)

formSchema.virtual('questionCount').get(function () {
    return this.questions.length;
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;