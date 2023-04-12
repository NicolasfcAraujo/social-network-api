import { Request, Response } from "express"

const { User: UserModel } = require("../models/user")
const { Post: PostModel } = require("../models/user")

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

            const response = await UserModel.create(user)
            res.status(201).json({response, msg: "Criado com sucesso!"})
        } catch (error) {
            console.log("Error creating a user")
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
    get: async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const user = await UserModel.findById(id)
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
                anotherUser: req.body.anotherUser,
                messages: req.body.messages
            }

            const anotherUserChat = {
                person: req.body.anotherUser,
                anotherUser: req.body.person,
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
    }
}

module.exports = userController