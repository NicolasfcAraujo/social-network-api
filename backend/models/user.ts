const { Schema } = require("mongoose")

const nowDate = new Date

const postSchema = new Schema({
    image_url: String,
    text: String,
    postDate: nowDate.getTime()
})

const messageSchema = new Schema({
    text: { type: String, require: true },
    messageDate: nowDate.getTime()
})

const chatSchema = new Schema({
    person: {type: String, require: true},
    messages: messageSchema
})

const userSchema = new Schema({
    user_name: {type: String, require: true},
    avatar_url: String,
    posts: postSchema,
    chats: chatSchema
}, {timestamps: true})

const User = require("mongoose").model("User", userSchema)

module.exports = { User }
