const mongoose = require("mongoose")

const User = new mongoose.Schema({
    first_name: String,
    last_name: String,
    username: String,
    chatId: Number,
    admin: Boolean,
    phone: String,
    language: String,
    createdAt: Date,
})

module.exports = mongoose.model("User", User)