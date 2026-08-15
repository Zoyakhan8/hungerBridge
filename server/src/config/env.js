import dotenv from "dotenv";
dotenv.config();
import {z} from "zod";
const portSchema=z.coerce.number().min(1).max(65535).default(3000)
export const PORT=portSchema.parse(process.env.PORT);
const dataBaseSchema=z.coerce.string()
export const DATABASE_URL=dataBaseSchema.parse(process.env.DATABASE_URL);
const mailUserSchema=z.string();
export const MAIL_USER=mailUserSchema.parse(process.env.MAIL_USER)
const mailPassSchema=z.string();
export const MAIL_PASS=mailPassSchema.parse(process.env.MAIL_PASS)
const verificationTokenSchema=z.string();
export const VERIFICATION_LINK_SECRET=verificationTokenSchema.parse(process.env.VERIFICATION_LINK_SECRET)
const cloudinaryCloudNameSchema=z.string();
export const CLOUDINARY_CLOUD_NAME=cloudinaryCloudNameSchema.parse(process.env.CLOUDINARY_CLOUD_NAME)
const cloudinaryApiKeySchema=z.string();
export const CLOUDINARY_API_KEY=cloudinaryApiKeySchema.parse(process.env.CLOUDINARY_API_KEY)
const cloudinaryApiSecretSchema=z.string();
export const CLOUDINARY_SECRET_KEY=cloudinaryApiSecretSchema.parse(process.env.CLOUDINARY_SECRET_KEY)
const accessTokenSchema=z.string();
export const ACCESS_SECRET_KEY=accessTokenSchema.parse(process.env.ACCESS_SECRET_KEY)
const refreshTokenSchema=z.string();
export const REFRESH_SECRET_KEY=refreshTokenSchema.parse(process.env.REFRESH_SECRET_KEY)
