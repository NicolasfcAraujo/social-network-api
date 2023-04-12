const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (arg0: null, arg1: string) => void) => {
        cb(null, "uploads/")
    },
    filename: (req: Request, file: Express.Multer.File, cb: (arg0: null, arg1: any) => void) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

module.exports = upload