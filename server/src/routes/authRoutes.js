import { Router } from "express"
import { changeEmail, DonorRegistration, forgetPassword, NgoRegistration, resetPassword, userLogin, verifyEmail, verifyOtp } from "../controller/registration";
import { validate } from "../middleware/validate";
import { DonorRegistrationSchema, loginSchema, NgoRegistrationSchema } from "../validator/RegisterSchema";
import { upload } from "../config/multer";
import { validateNgoFiles } from "../utils/validateNgoFiles";
import { isDonor, isNgo, verifyToken } from "../middleware/auth";
export const authRoutes = Router();
authRoutes.post("/register-donor", validate(DonorRegistrationSchema), DonorRegistration)
authRoutes.get("/verify-email/:token",verifyEmail)
authRoutes.post(
    "/register-ngo",
    upload.fields([
        { name: "registrationDocument", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "addressProof", maxCount: 1 },
    ]),validate(NgoRegistrationSchema),validateNgoFiles,
    NgoRegistration
);
authRoutes.post("/login",validate(loginSchema),userLogin)
authRoutes.post("/forget-password", forgetPassword);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/reset-password",resetPassword)
authRoutes.post("/change-email",changeEmail)
authRoutes.get("/authenticate", verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});
authRoutes.get("/donor",verifyToken,isDonor)
authRoutes.get("/ngo",verifyToken,isNgo)