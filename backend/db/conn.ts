const mongoose = require("mongoose")
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

async function main(){
    try {
        mongoose.set("strictQuery", true)
        await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPass}@cluster0.dztjeg6.mongodb.net/?retryWrites=true&w=majority`
        )
    } catch (error) {
        console.log("Server connection error")
    }
}

module.exports = main