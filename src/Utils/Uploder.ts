import path from "path";
import multer from "multer";
import { AppError } from "./AppError";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "..", "public", "course", "avatars"));
    },
    filename(req, file, callback) {
        let filename = Date.now() + String(Math.floor((Math.random() * 300) + (Math.random() * 300)));
        let ext = path.extname(file.originalname);
        callback(null, filename + ext);
    },
})
function fileFilter(req: any, file: Express.Multer.File, callback: any) {
    const allowedExt = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExt.includes(ext)) {
        return callback(new AppError("Unsupported file type", 422));
    }
    callback(null, true);
}
const UploderCover = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})
export default UploderCover;