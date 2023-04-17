"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User: UserModel } = require("../models/user");
const userController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = {
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_pass: req.body.user_pass,
                avatar_url: req.body.avatar_url,
                posts: req.body.posts,
                chats: req.body.chats
            };
            if (!user.user_name) {
                return res.status(422).json({ msg: "User name is require" });
            }
            if (!user.user_email) {
                return res.status(422).json({ msg: "User email is require" });
            }
            if (!user.user_pass) {
                return res.status(422).json({ msg: "User pass is require" });
            }
            const userExist = yield UserModel.findOne({ user_email: user.user_email });
            if (userExist) {
                return res.status(422).json({ msg: "This email is already registered" });
            }
            const salt = yield bcrypt.genSalt(12);
            const passwordHash = yield bcrypt.hash(user.user_pass, salt);
            const file = req.file;
            const path = "https://social-network-api-b728.onrender.com/api/";
            user.user_pass = passwordHash;
            if (file !== null) {
                user.avatar_url = `${path}/files/${file === null || file === void 0 ? void 0 : file.filename}`;
            }
            const response = yield UserModel.create(user);
            res.status(201).json({ response, msg: `User created! ${file}` });
        }
        catch (error) {
            console.log("Error creating a user");
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const login = {
            user_email: req.body.user_email,
            user_pass: req.body.user_pass
        };
        if (!login.user_email) {
            return res.status(422).json({ msg: "Email is required" });
        }
        if (!login.user_pass) {
            return res.status(422).json({ msg: "Password is required" });
        }
        const user = yield UserModel.findOne({ user_email: login.user_email });
        console.log(user);
        if (!user) {
            return res.status(422).json({ msg: "User not found" });
        }
        const checkPassword = yield bcrypt.compare(login.user_pass, user.user_pass);
        if (!checkPassword) {
            return res.status(422).json({ msg: "Incorrect password" });
        }
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });
        return res.json({ user, token });
    }),
    verifyUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const user = yield UserModel.findById(id, "-user_pass");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Access denied" });
        }
        try {
            const secret = process.env.SECRET;
            jwt.verify(token, secret, (err, decoded) => {
                console.log(err);
                return res.json({ decoded });
            });
        }
        catch (error) {
            console.log(error);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield UserModel.find();
            res.json(users);
        }
        catch (error) {
            console.log("Error showing the users");
        }
    }),
    get: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield UserModel.findById(id, "-user_pass");
            if (!user) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            res.json(user);
        }
        catch (error) {
            console.log("Error showing the user");
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield UserModel.findById(id);
            if (!user) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            const deleteUser = yield UserModel.findByIdAndDelete(id);
            res.status(200).json({
                deleteUser, msg: "User deleted"
            });
        }
        catch (error) {
            console.log("Error deleting the user");
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = {
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_pass: req.body.user_pass,
                avatar_url: req.body.avatar_url,
                posts: req.body.posts,
                chats: req.body.chats
            };
            const updatedUser = yield UserModel.findByIdAndUpdate(id, user);
            if (!updatedUser) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            res.status(200).json({ user, msg: "updated" });
        }
        catch (error) {
            console.log("Error updating the user #update");
        }
    }),
    createPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const post = {
                image_url: req.body.image_url,
                text: req.body.text,
            };
            const user = yield UserModel.findById(id);
            if (!user) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            const newPost = yield UserModel.findByIdAndUpdate({ _id: id }, { $push: { posts: post } });
            res.status(200).json({ newPost, msg: "New post created!" });
        }
        catch (error) {
            console.log("Error creating post");
        }
    }),
    createChat: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const anotherUserId = req.params.anotherUserId;
            const chat = {
                person: req.body.person,
                anotherUser: req.body.anotherUser,
                messages: req.body.messages
            };
            const anotherUserChat = {
                person: req.body.anotherUser,
                anotherUser: req.body.person,
                messages: req.body.messages
            };
            const user = yield UserModel.findById(id);
            const anotherUser = yield UserModel.findById(anotherUserId);
            if (!user || !anotherUser) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            const newChat = yield UserModel.findByIdAndUpdate({ _id: id }, { $push: { chats: chat } });
            const anotherUserNewChat = yield UserModel.findByIdAndUpdate({ _id: anotherUserId }, { $push: { chats: anotherUserChat } });
            res.status(200).json({ newChat, anotherUserNewChat, msg: "Chat created" });
        }
        catch (error) {
            console.log(error);
        }
    }),
    sendMessage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const senderId = req.params.senderId;
            const receiverId = req.params.receiverId;
            const message = {
                text: req.body.text,
                who: req.body.who
            };
            const user = yield UserModel.findById(senderId);
            const anotherUser = yield UserModel.findById(receiverId);
            if (!user || !anotherUser) {
                res.status(404).json({ msg: "404. not found" });
                return;
            }
            const newMessage = yield UserModel.findOneAndUpdate({ "chats.person": senderId, "chats.anotherUser": receiverId }, { $push: { "chats.$.messages": message } });
            const anotherUserNewMessage = yield UserModel.findOneAndUpdate({ "chats.person": receiverId, "chats.anotherUser": senderId }, { $push: { "chats.$.messages": message } });
            res.status(200).json({ newMessage, anotherUserNewMessage, msg: `Message created` });
        }
        catch (error) {
            console.log(error);
        }
    })
};
module.exports = userController;
