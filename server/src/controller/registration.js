import { hashPassword, verifyPassword } from "../utils/hash";
import { db } from "../config/dbClient.js";
import { donors } from "../model/donorRegisterSchema.ts";
import { eq, or, and } from "drizzle-orm";
import { sendMail } from "../config/sendMail.js";
import { verificationToken } from "../model/verificationLinkSchema.ts";
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, VERIFICATION_LINK_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken"
import { ngos } from "../model/ngoRegisterSchema.ts";
import { users } from "../model/userSchema.ts";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { sessions } from "../model/sessionsSchema.ts";
import { sendOTP } from "../config/sendOTP.js";
import { otps } from "../model/otpSchema.ts";
import { geocodeAddress } from "../utils/geocodeAddress.ts";
export const DonorRegistration = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, companyName } = req.body;
        const hashedPassword = await hashPassword(password)
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }
        let verificationTokenValue = "";
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        await db.transaction(async (tx) => {

            const [user] = await tx.insert(users).values({
                email, phoneNumber, password: hashedPassword, role: "donor", emailVerified: false
            }).returning()
            verificationTokenValue = jwt.sign(
                { userId: user.publicId },
                VERIFICATION_LINK_SECRET,
                { expiresIn: "1h" }
            );
            await tx.insert(donors).values({
                name,
                email,
                phoneNumber,
                companyName,
                approved: false,
                userId: user.id
            })
            await tx.insert(verificationToken).values({
                userId: user.id, verificationToken: verificationTokenValue, expiresAt
            })
        });
        const verificationLink = `http://localhost:5173/verify-email/${verificationTokenValue}`;
        await sendMail(email, name, verificationLink)
        return res.status(200).json({
            success: true,
            message: "Registration is successful please verify"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: true,
            message: "Server Error"
        })
    }
}
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params
        const verification = await db
            .select()
            .from(verificationToken)
            .where(eq(verificationToken.verificationToken, token));
        if (!verification) {
            return res.status(404).json({
                success: false,
                message: "This verification link has already been used.",
            });
        }
        if (verification.expiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Verification link expired",
            });
        }
        const payload = jwt.verify(token, VERIFICATION_LINK_SECRET);
        const publicId = payload.userId
        const [user] = await db
            .select({
                id: users.id,
            })
            .from(users)
            .where(eq(users.publicId, publicId));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await db
            .update(users)
            .set({
                emailVerified: true,
            })
            .where(eq(users.id, user.id));
        await db
            .delete(verificationToken)
            .where(eq(verificationToken.verificationToken, token));
        return res.status(200).json({ success: true, message: "Email verified successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: "Server Error" })
    }
}
export const NgoRegistration = async (req, res) => {
    try {
        const {
            organizationName,
            registeredNumber,
            registeredAddress,
            email,
            phoneNumber,
            password,
        } = req.body;
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email));
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }
        const hashedPassword = await hashPassword(password)
        const registration = await uploadToCloudinary(
            req.files.registrationDocument[0],
            "ngo/registration"
        );

        const pan = await uploadToCloudinary(
            req.files.panCard[0],
            "ngo/pan"
        );

        const address = await uploadToCloudinary(
            req.files.addressProof[0],
            "ngo/address"
        );
        const coordinates = await geocodeAddress(registeredAddress);
        if (!coordinates) {
            return res.status(422).json({
                success: false,
                message: "Could not locate this shop address. Please provide a more complete address.",
            });
        }
        console.log(coordinates)
        let verificationTokenValue = "";
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        await db.transaction(async (tx) => {

            const [user] = await tx.insert(users).values({
                email, phoneNumber, password: hashedPassword, role: "ngo", emailVerified: false
            }).returning()
            verificationTokenValue = jwt.sign(
                { userId: user.publicId },
                VERIFICATION_LINK_SECRET,
                { expiresIn: "1h" }
            );
            await tx.insert(ngos).values({
                organizationName,
                registeredNumber,
                registeredAddress,
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                email,
                phoneNumber,
                registrationCertificateUrl: registration,
                panCardUrl: pan,
                addressProofUrl: address,
                verifyStatus: "pending",
                userId: user.id
            })
            await tx.insert(verificationToken).values({
                userId: user.id, verificationToken: verificationTokenValue, expiresAt
            })

        });
        const name = organizationName
        const verificationLink = `http://localhost:5173/verify-email/${verificationTokenValue}`;
        await sendMail(email, name, verificationLink)
        return res.status(200).json({
            success: true,
            message: "Registration is successful please verify your email"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: true,
            message: "Server Error"
        })
    }
}
export const userLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const [user] = await db.select().from(users).
            where(or(
                eq(users.email, identifier),
                eq(users.phoneNumber, identifier)
            ));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
        if (!user.emailVerified) {
            await db
                .delete(verificationToken)
                .where(eq(verificationToken.userId, user.id));
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
            let verificationTokenValue = jwt.sign(
                { userId: user.publicId },
                VERIFICATION_LINK_SECRET,
                { expiresIn: "1h" }
            );
            await db.insert(verificationToken).values({
                userId: user.id, verificationToken: verificationTokenValue, expiresAt
            })
            const verificationLink = `http://localhost:5173/verify-email/${verificationTokenValue}`;
            await sendMail(user.email, "User", verificationLink)
            return res.status(403).json({
                success: false,
                code: "EMAIL_NOT_VERIFIED",
                email: user.email,
                message: "We had resend the link,Please verify your email",
            });
        }
        const isMatch = await verifyPassword(user.password, password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid password",
            });
        }
        const accessToken = jwt.sign(
            { id: user.publicId, role: user.role },
            ACCESS_SECRET_KEY,
            { expiresIn: "15min" }
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        const refreshToken = jwt.sign(
            { id: user.publicId },
            REFRESH_SECRET_KEY,
            { expiresIn: "1hr" }
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1 * 60 * 60 * 1000
        })
        const ipAddress = req.clientIp
        const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000)
        await db.insert(sessions).values({
            userId: user.id,
            refreshToken,
            ipAddress,
            expiresAt
        })
        return res.status(200).json({
            success: true,
            message: "Welcome Back to hungerBridge",
            role: user.role
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
export const changeEmail = async (req, res) => {
    try {
        const { currentEmail, email } = req.body;
        const [user] = await db.select().from(users).
            where(eq(users.email, currentEmail));
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }
        if (user.email === email) {
            return res.status(400).json({
                success: false,
                message: "Please enter a different email address",
            });
        }
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "This email is already registered",
            });
        }
        await db
            .update(users)
            .set({
                email: email,
                emailVerified: false,
            })
            .where(eq(users.id, user.id));
        await db
            .delete(verificationToken)
            .where(eq(verificationToken.userId, user.id));
        let verificationTokenValue = jwt.sign(
            { userId: user.publicId },
            VERIFICATION_LINK_SECRET,
            { expiresIn: "1h" }
        );
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
        await db.insert(verificationToken).values({
            userId: user.id, verificationToken: verificationTokenValue, expiresAt
        })
        const verificationLink = `http://localhost:5173/verify-email/${verificationTokenValue}`;
        await sendMail(email, "HungerBridge's User", verificationLink)
        return res.status(200).json({
            success: true,
            message: "Email Changed successfully, please verify"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: true,
            message: "Server Error"
        })
    }
}
export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const [user] = await db.select()
            .from(users)
            .where(eq(users.email, email))
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid email" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await hashPassword(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
        await db.insert(otps).values({ email, otp: hashedOtp, expiresAt })
        await sendOTP(email, otp)
        return res.status(200).json({ success: true, message: "OTP is sent to your email" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const [verifyOtp] = await db
            .select()
            .from(otps)
            .where(eq(otps.email, email))
        if (!verifyOtp) {
            return res.status(400).json({ success: false, message: "OTP is incorrect" })
        }
        if (new Date() > verifyOtp.expiresAt) {
            await db.delete(otps).where(eq(otps.email, email))
            return res.status(403).json({
                success: false,
                message: "OTP has been expired"
            })
        }
        const isValid = await verifyPassword(verifyOtp.otp, otp)
        if (!isValid) {
            return res.status(400).send("Invalid OTP.");
        }
        return res.status(200).json({ success: true, message: "OTP verified successfully!!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}
export const resetPassword = async (req, res) => {
    try {
        const { password, email } = req.body;
        const hashedPassword = await hashPassword(password)
        await db
            .update(users)
            .set({ password: hashedPassword })
            .where(eq(users.email, email))
        await db.delete(otps).where(eq(otps.email, email))
        return res.status(200).json({ success: true, message: "Password reset successfully!!" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}