require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const conn = require("./db/conn")
const cors = require("cors")
const routes = require("./routes/router")

const app = express()

conn()
app.use(cors())
app.use(express.json())
app.use("/api", routes)


app.listen(3000, () => {
    console.log("Server Online!")
})

export {}