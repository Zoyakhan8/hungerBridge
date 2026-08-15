export const validateNgoFiles = (req, res, next) => {
    if (!req.files?.registrationDocument?.length) {
        return res.status(400).json({
            success: false,
            message: "Registration certificate is required",
        });
    }

    if (!req.files?.panCard?.length) {
        return res.status(400).json({
            success: false,
            message: "PAN card is required",
        });
    }

    if (!req.files?.addressProof?.length) {
        return res.status(400).json({
            success: false,
            message: "Address proof is required",
        });
    }

    next();
};