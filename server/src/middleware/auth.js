import jwt from "jsonwebtoken";
import { ACCESS_SECRET_KEY } from "../config/env.js";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};
export const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "access denied" });
    }
    next();
};
export const isDonor = (req, res, next) => {
    if (req.user.role !== "donor") {
        return res.status(403).json({ message: "access denied" });
    }
    next();
};
export const isNgo = (req, res, next) => {
    if (req.user.role !== "ngo") {
        return res.status(403).json({ message: "access denied" });
    }
    next();
};
