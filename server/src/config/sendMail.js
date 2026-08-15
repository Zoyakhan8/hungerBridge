import nodemailer from "nodemailer";
import { MAIL_PASS, MAIL_USER } from "./env.js";

export const sendMail = async (to,name, verificationLink) => {

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
            subject: "Verify your HungerBridge account",
            html: `
    <h2 style="color:#16a34a;">Welcome to HungerBridge!</h2>

    <p>Hello <strong>${name}</strong>,</p>

    <p>Thank you for registering with <strong>HungerBridge</strong>.</p>

    <p>Please verify your email address by clicking the button below to activate your account.</p>

    <div style="text-align:center;margin:30px 0;">
        <a href="${verificationLink}"
            style="
                display:inline-block;
                background:#16a34a;
                color:#ffffff;
                text-decoration:none;
                padding:14px 28px;
                border-radius:8px;
                font-size:16px;
                font-weight:bold;
            ">
            Verify Email
        </a>
    </div>

    <p><strong>This verification link is valid for 1 hour.</strong></p>

    <hr style="margin:30px 0;">

    <p style="color:#6b7280;">
        If the button doesn't work, copy and paste the following link into your browser:
    </p>

    <p>
        <a href="${verificationLink}" style="color:#16a34a;word-break:break-all;">
            ${verificationLink}
        </a>
    </p>

    <p style="color:#6b7280;">
        If you didn't create a HungerBridge account, you can safely ignore this email.
    </p>

    <p>
        Regards,<br>
        <strong>HungerBridge Team</strong>
    </p>
`
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