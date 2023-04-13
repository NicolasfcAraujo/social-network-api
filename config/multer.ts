import { FileFilterCallback } from "multer"

const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req: Request, file: File, callback: (arg0: null, arg1: any) => void) => {
        callback(null, path.resolve("uploads"))
    },
    filename: (req: Request, file: Express.Multer.File, callback: (arg0: null, arg1: string) => void) => {
        const time =  new Date().getTime()

        callback(null, `${time}_${file.originalname}`)
    }
})

const upload = multer({storage})

module.exports = upload