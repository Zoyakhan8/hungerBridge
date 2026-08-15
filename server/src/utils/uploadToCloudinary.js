import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
export const uploadToCloudinary = (file, folder) => {
    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "auto"
            },
            (error, result) => {

                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }

            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);

    });
};