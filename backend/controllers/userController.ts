import { NextFunction, Request, Response } from "express"
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { User: UserModel } = require("../models/user")

const userController = {
    create: async (req: Request, res: Response) => {
        try {
            const user = {
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_pass: req.body.user_pass,
                avatar_url: req.body.avatar_url,
                posts: req.body.posts,
                chats: req.body.chats
            }

            if(!user.user_name){
                return res.status(422).json({msg: "User name is require"})
            }

            if(!user.user_email){
                return res.status(422).json({msg: "User email is require"})
            }

            if(!user.user_pass){
                return res.status(422).json({msg: "User pass is require"})
            }

            const userExist = await UserModel.findOne({user_email: user.user_email})
            if(userExist) {
                return res.status(422).json({msg: "This email is already registered"})
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(user.user_pass, salt)

            const file = req.file
            const path = "https://social-network-api-b728.onrender.com/api/"
            user.user_pass = passwordHash

            if(file !== null){
                user.avatar_url = `${path}/files/${file?.filename}`
            }
            
            const response = await UserModel.create(user)
            res.status(201).json({response, msg: `User created! ${file}`})
        } catch (error) {
            console.log("Error creating a user")
        }
    },
    login: async (req: Request, res: Response) => {
        const login = {
            user_email: req.body.user_email,
            user_pass: req.body.user_pass
        }

        if(!login.user_email) {
            return res.status(422).json({msg: "Email is required"})
        }

        if(!login.user_pass) {
            return res.status(422).json({msg: "Password is required"})
        }

        const user = await UserModel.findOne({user_email: login.user_email})

        console.log(user)

        if(!user) {
            return res.status(422).json({msg: "User not found"})
        }

        const checkPassword = await bcrypt.compare( login.user_pass, user.user_pass)

        if(!checkPassword) {
            return res.status(422).json({msg: "Incorrect password"})
        }
        
        const secret = process.env.SECRET
        const token = jwt.sign({id: user._id},secret,{expiresIn: 86400})

        return res.json({user, token})
    },
    verifyUser: async (req: Request, res: Response) => {
        const id = req.params.id

        const user = await UserModel.findById(id, "-user_pass")

        if(!user){
            return res.status(404).json({msg: "User not found"})
        }

        const authHeader = req.headers["authorization"]
        const token = authHeader

        console.log(token)

        if(!token) {
            return res.status(401).json({ msg: "Access denied"})
        }

        try {
            const secret = process.env.SECRET

            const decoded = jwt.verify(token, secret)

            return res.json({decoded})
        } catch (error) {
            console.log(`error do catch: ${error}`)
        }

    },
    getAll: async (req: Request, res: Response) => {
        try {
            const users = await UserModel.find()
            res.json(users)
        } catch (error) {
            console.log("Error showing the users")
        }
    },
    get: async (req: Request, res: Response, next: NextFunction) => {/*
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]

        if(!token) {
            return res.status(401).json({msg: "Access denied"})
        }

        try {
            const secret = process.env.SECRET
            
            jwt.verify(token, secret)

            next()
        } catch (error) {
            res.status(400).json({msg: "invalid token"})
        }*/

        try {
            const id = req.params.id
            const user = await UserModel.findById(id, "-user_pass")
            if(!user) {
                res.status(404).json({msg: "404. not found"})
                return
            }
            res.json(user)
        } catch (error) {
            console.log("Error showing the user")
        }
    },
    delete: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const user = await UserModel.findById(id)

            if (!user) {
                res.status(404).json({msg: "404. not found"})
                return
            }

            const deleteUser = await UserModel.findByIdAndDelete(id)
            res.status(200).json({
                deleteUser, msg: "User deleted"
            })
        } catch (error) {
            console.log("Error deleting the user")
        }
    },
    update: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const user = {
                user_name: req.body.user_name,
                user_email: req.body.user_email,
                user_pass: req.body.user_pass,
                avatar_url: req.body.avatar_url,
                posts: req.body.posts,
                chats: req.body.chats
            }

            const updatedUser = await UserModel.findByIdAndUpdate(id, user)

            if(!updatedUser) {
                res.status(404).json({msg: "404. not found"})
                return
            }

            res.status(200).json({user, msg: "updated"})
        } catch (error) {
            console.log("Error updating the user #update")
        }
    },
    createPost: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const post = {
                image_url: req.body.image_url,
                text: req.body.text,
            }
            const user = await UserModel.findById(id)
            if(!user) {
                res.status(404).json({msg: "404. not found"})
                return
            }
            const newPost = await UserModel.findByIdAndUpdate({_id: id}, { $push: { posts: post } })

            res.status(200).json({newPost, msg: "New post created!"})
        } catch (error) {
            console.log("Error creating post")
        }
    },
    createChat: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const anotherUserId = req.params.anotherUserId

            const chat = {
                person: req.body.person,
                person_email: req.body.person_email,
                anotherUser: req.body.anotherUser,
                anotherUser_email: req.body.anotherUser_email,
                messages: req.body.messages
            }

            const anotherUserChat = {
                person: req.body.anotherUser,
                person_email: req.body.anotherUser_email,
                anotherUser: req.body.person,
                anotherUser_email: req.body.person_email,
                messages: req.body.messages
            }

            const user = await UserModel.findById(id)
            const anotherUser = await UserModel.findById(anotherUserId)
            if(!user || !anotherUser) {
                res.status(404).json({msg: "404. not found"})
                return
            }

            const newChat = await UserModel.findByIdAndUpdate({_id: id}, { $push: { chats: chat } })
            const anotherUserNewChat = await UserModel.findByIdAndUpdate({_id: anotherUserId}, { $push: { chats: anotherUserChat } })

            res.status(200).json({newChat, anotherUserNewChat, msg: "Chat created"})

        } catch (error) {
            console.log(error)
        }
    },
    sendMessage: async (req: Request, res: Response) => {
        try {
            const senderId = req.params.senderId
            const receiverId = req.params.receiverId

            const message = {
                text: req.body.text,
                who: req.body.who
            }

            const user = await UserModel.findById(senderId)
            const anotherUser = await UserModel.findById(receiverId)
            if(!user || !anotherUser) {
                res.status(404).json({msg: "404. not found"})
                return
            }

            const newMessage = await UserModel.findOneAndUpdate({"chats.person_email": user.user_email, "chats.anotherUser_email": anotherUser.user_email}, { $push: { "chats.$[filter].messages": message }}, {arrayFilters: [{"filter.anotherUser_email": anotherUser.user_email}]})
            const anotherUserNewMessage = await UserModel.findOneAndUpdate({"chats.person_email": anotherUser.user_email, "chats.anotherUser_email": user.user_email}, { $push: { "chats.$[filter].messages": message }}, {arrayFilters: [{"filter.anotherUser_email": user.user_email}]})

            res.status(200).json({newMessage, anotherUserNewMessage, msg: `Message created`})
        } catch (error) {
            console.log(error)
        }
    },
    getChat: async (req: Request, res: Response) => {
        try {
            const senderId = req.params.senderId
            const receiverId = req.params.receiverId

            const user = await UserModel.findById(senderId)
            const anotherUser = await UserModel.findById(receiverId)
            if(!user || !anotherUser) {
                res.status(404).json({msg: "404. not found"})
                return
            }

            const senderChat = await UserModel.findOne({"chats.person_email": user.user_email, "chats.anotherUser_email": anotherUser.user_email})
            
            res.json(senderChat)
        } catch (error) {
            console.log("Error getting chat")
        }
    }, 

}

module.exports = userController