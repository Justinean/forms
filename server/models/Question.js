const { Schema, model } = require('mongoose');
const choiceSchema = require("./Choice");

const questionSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        number: {
            type: Number,
            require: true
        },
        hasOther: {
            type: Boolean,
            require: true
        },
        choices: [choiceSchema]
    },
    {
        _id: false
    }
)

module.exports = questionSchema;