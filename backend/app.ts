import { Request, Response } from "express"

require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const conn = require("./db/conn")

const app = express()

conn()
app.use(cors())
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({msg: "Bem vindo a nossa"})
})

app.listen(3000, () => {
    console.log("Server Online!")
})