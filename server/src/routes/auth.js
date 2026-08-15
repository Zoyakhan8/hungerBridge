import { Router } from "express"
import { changeEmail, DonorRegistration, forgetPassword, NgoRegistration, resetPassword, userLogin, verifyEmail, verifyOtp } from "../controller/registration";
import { validate } from "../middleware/validate";
import { DonorRegistrationSchema, loginSchema, NgoRegistrationSchema } from "../validator/RegisterSchema";
import { upload } from "../config/multer";
import { validateNgoFiles } from "../utils/validateNgoFiles";
import { isDonor, isNgo, verifyToken } from "../middleware/auth";
const router = Router();
router.post("/register-donor", validate(DonorRegistrationSchema), DonorRegistration)
router.get("/verify-email/:token",verifyEmail)
router.post(
    "/register-ngo",
    upload.fields([
        { name: "registrationDocument", maxCount: 1 },
        { name: "panCard", maxCount: 1 },
        { name: "addressProof", maxCount: 1 },
    ]),validate(NgoRegistrationSchema),validateNgoFiles,
    NgoRegistration
);
router.post("/login",validate(loginSchema),userLogin)
router.post("/forget-password", forgetPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password",resetPassword)
router.post("/change-email",changeEmail)
router.get("/authenticate", verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        user: req.user,
    });
});
router.get("/donor",verifyToken,isDonor)
router.get("/ngo",verifyToken,isNgo)
export default router;