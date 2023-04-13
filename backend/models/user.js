"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { Schema } = mongoose;
const postSchema = new Schema({
    image_url: { type: String, default: "" },
    text: { type: String, require: true }
}, { timestamps: true });
const messageSchema = new Schema({
    text: { type: String, require: true },
    who: { type: String, require: true }
}, { timestamps: true });
const chatSchema = new Schema({
    person: { type: String, require: true },
    anotherUser: { type: String, require: true },
    messages: [messageSchema]
});
const userSchema = new Schema({
    user_name: { type: String, require: true },
    user_email: { type: String, require: true },
    user_pass: { type: String, require: true },
    avatar_url: { type: String, default: "" },
    posts: [postSchema],
    chats: [chatSchema]
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
module.exports = { User };
