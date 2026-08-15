import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const VerifyEmail = () => {
    const { token } = useParams();

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/api/auth/verify-email/${token}`
                );

                const data = await response.json();
                setSuccess(data.success);
                setMessage(data.message);
            } catch (error) {
                setSuccess(false);
                setMessage("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h2 className="text-2xl font-semibold">
                    Verifying your email...
                </h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-[450px] text-center">
                <h1
                    className={`text-3xl font-bold ${
                        success ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {success ? "Email Verified " : "Verification Failed"}
                </h1>

                <p className="mt-4 text-gray-600">
                    {message}
                </p>
            </div>
        </div>
    );
};

