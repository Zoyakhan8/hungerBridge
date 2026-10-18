
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/config/dbClient";
import { users } from "../src/model/userSchema";
import { hashPassword } from "../src/utils/hash";

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const phoneNumber = process.env.ADMIN_PHONE_NUMBER?.trim();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !phoneNumber || !password) {
        throw new Error(
            "Set ADMIN_EMAIL, ADMIN_PHONE_NUMBER and ADMIN_PASSWORD."
        );
    }

    if (password.length < 12) {
        throw new Error("Admin password must be at least 12 characters.");
    }

    const [existingUser] = await db
        .select({
            id: users.id,
            role: users.role,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser) {
        if (existingUser.role !== "admin") {
            throw new Error(
                "This email already belongs to a non-admin account. No changes were made."
            );
        }

        console.log("An admin with this email already exists. No changes made.");
        return;
    }

    const hashedPassword = await hashPassword(password);

    await db.insert(users).values({
        email,
        phoneNumber,
        password: hashedPassword,
        role: "admin",
        emailVerified: true,
    });

    console.log(`Admin account created successfully for ${email}.`);
}

seedAdmin()
    .catch((error) => {
        console.error("Admin seeding failed:", error.message);
        process.exitCode = 1;
    })
    .finally(() => {
    });
