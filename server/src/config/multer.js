import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        console.log(file.originalname);
        console.log(file.mimetype);

        const allowed = [
            "application/pdf",
            "image/jpeg",
            "image/png",
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG and PDF files are allowed"));
        }

        cb(null, true);
    },
});