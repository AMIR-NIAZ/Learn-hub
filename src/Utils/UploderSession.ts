import path from "path";
import multer from "multer";
import { AppError } from "./AppError";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, path.join(__dirname, "..", "public", "course", "Sessions"));
    },
    filename(req, file, callback) {
        let filename = Date.now() + String(Math.floor((Math.random() * 300) + (Math.random() * 300)));
        let ext = path.extname(file.originalname);
        callback(null, filename + ext);
    },
})
function fileFilter(req: any, file: Express.Multer.File, callback: any) {
    const allowedExt = "mp4";
    const ext = path.extname(file.originalname).toLowerCase();

    // if (ext !== allowedExt) {
    //     return callback(new AppError("Unsupported file type", 422));
    // }
    callback(null, true);
}
const UploderSession = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 30
    }
})
export default UploderSession;