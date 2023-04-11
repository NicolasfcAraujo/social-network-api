import { Request, Response } from "express"

const router = require("express").Router()
const userController = require("../controllers/userController")


router.route("/users").post((req: Request, res: Response) => userController.create(req, res))

router.route("/users").get((req: Request, res: Response) => userController.getAll(req, res))

router.route("/users/:id").get((req: Request, res: Response) => userController.get(req, res))

router.route("/users/:id").delete((req: Request, res: Response) => userController.delete(req, res))

router.route("/users/:id").put((req: Request, res: Response) => userController.update(req, res))

router.route("/users/:id/post").put((req: Request, res: Response) => userController.createPost(req, res))

router.route("/users/:id/createPost/:anotherUserId").put((req: Request, res: Response) => userController.createChat(req, res))


module.exports = router

export{}