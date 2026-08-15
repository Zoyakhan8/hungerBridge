import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "./env.js";

export const sendOTP = async (to, otp) => {

    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
            }
        });
        const info = await transporter.sendMail({
            from: `HungerBridge Team ${MAIL_USER}`,
            to,
            subject: "Reset Your HungerBridge Account Password",
            html: `
                 <p>Hello,</p>

        <p>We received a request to reset the password for your HungerBridge account.</p>

        <p>Use the verification code below to continue:</p>
            <div style="
            text-align:center;
            font-size:34px;
            font-weight:bold;
            letter-spacing:10px;
            background:#f3f4f6;
            padding:18px;
            border-radius:8px;
            margin:25px 0;">
            ${otp}
        </div>

        <p><strong>This OTP is valid for 5 minutes.</strong></p>

        <p>Do not share this code with anyone.</p>

        <hr style="margin:30px 0;">

        <p style="color:#6b7280;">
            If you didn't request a password reset, you can safely ignore this email.
            Your password will remain unchanged.
        </p>

        <p>Regards,<br>
        <strong>HungerBridge Team</strong></p>`
        });

        console.log("Message sent:", info);

        console.log(
            "Preview URL:",
            nodemailer.getTestMessageUrl(info)
        );

    } catch (error) {

        console.log(error);

    }

};