export const validateDonorFiles = (req, res, next) => {
    if (!req.files?.photo?.length) {
        return res.status(400).json({
            success: false,
            message: "Photo is required",
        });
    }
    if (!req.files?.aadhar?.length) {
        return res.status(400).json({
            success: false,
            message: "Aadhaar is required",
        });
    }

    if (!req.files?.shopLicense?.length) {
        return res.status(400).json({
            success: false,
            message: "Shop License is required",
        });
    }
    next();
};