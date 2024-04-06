const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const colleagueRegistration = new Schema({
    First_Name : {
        type: String,
        required: true,
        default: "",
    },
    Last_Name: {
        type: String,
        required: true,
        default: "",
    },
    email : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

module.exports = mongoose.model('Colleague', colleagueRegistration);