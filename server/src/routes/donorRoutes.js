import { Router } from "express"
import { isDonor, verifyToken } from "../middleware/auth";
import { classifyFoodController, createDonation, donorDashboard, getDonorDonationHistory, profileSetup } from "../controller/donor";
import { upload } from "../config/multer";
import { validateDonorFiles } from "../utils/validateDonorFiles";
export const donorRoutes = Router();
donorRoutes.get(
    "/dashboard",
    verifyToken,
    isDonor,
    donorDashboard
);
donorRoutes.get(
  "/donations",
  verifyToken,
  isDonor,
  getDonorDonationHistory
);
donorRoutes.post("/classify", classifyFoodController);
donorRoutes.post("/create-donation",verifyToken,isDonor,createDonation)
donorRoutes.post("/create-profile",
    upload.fields([
        { name: "photo", maxCount: 1 },
        { name: "aadhar", maxCount: 1 },
        { name: "shopLicense", maxCount: 1 },
    ]),validateDonorFiles
    ,verifyToken,isDonor,profileSetup)