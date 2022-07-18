const { Schema, model } = require('mongoose');

const choiceSchema = new Schema(
    {
        name: {
            type: String,
            require: true
        }
    },
    {
        _id: false
    }
)

module.exports = choiceSchema;