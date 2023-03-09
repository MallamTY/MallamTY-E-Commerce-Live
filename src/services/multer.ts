
import multer from "multer";

const storage = multer.memoryStorage();

const filefilter: any = (req: Request, file: any, cb: CallableFunction) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' 
        || file.mimetype === 'application/pdf' || file.mimetype === 'audio/mpeg'|| file.mimetype === 'video/mp4' ){
        cb(null, true)
    }

    else{
        cb(null, false)
    }
}
export const multerUploads = multer({ storage, fileFilter: filefilter }).single('image');
export const multiMulterUploads = multer({storage}).any();


