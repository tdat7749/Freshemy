import multer from "multer";

const storage = multer.diskStorage({
    filename: (req, file: Express.Multer.File, cb) => {
        cb(null, "/tmp/");
    },
});

export const uploadFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("thumbnail");

// Upload video
const storageVideo = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "C:\\Freshemy-video\\upload\\videos");
    },
    filename: (req, file: Express.Multer.File, cb) => {
        const extension = file.originalname.split(".").pop();
        const uniqueFileNameRandom = `${Date.now()}-${file.fieldname}.${extension}`;
        cb(null, uniqueFileNameRandom);
    },
});

export const uploadVideo = multer({
    storage: storageVideo,
    limits: {
        fileSize: 1024 * 1024 * 100, //100MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "video/mp4") {
            cb(null, true);
        } else if (file.mimetype === "video/x-matroska") {
            cb(null, true);
        } else if (file.mimetype === "video/mov") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type: Only .mp4, .mkv or .mov is allowed"));
        }
    },
}).single("video");
