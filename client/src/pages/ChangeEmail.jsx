import { useState } from "react";
import { Message } from "../components/Message";
import { useLocation } from "react-router-dom";
export const ChangeEmail = () => {
    const location = useLocation();
    const currentEmail = location.state?.currentEmail;
    const [email, setEmail] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });
    const handleEmailSubmit = async (event) => {
        event.preventDefault()
        console.log("formSubmitted", email)
        try {
            const res = await fetch("/api/auth/change-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentEmail,email })
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Email Change Successfully",
                    message: data.message,
                });
                setShowMessage(true);
            } else {
                setMessageData({
                    type: "error",
                    title: "Email Change Failed",
                    message: data.message,
                });
                setShowMessage(true);
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Email Change Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
        }
    };
    return (
        <div className="bg-brown">
            <div className="min-h-screen bg-brown-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md  rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Change Email
                        </h1>
                        <p className="text-gray-500 mt-2">
                            Enter your email to receive an verification link
                        </p>
                        <div className="text-inactive mt-2 flex gap-2">
                            <p>Current email:</p>
                            <p>{currentEmail}</p>
                        </div>
                        <form onSubmit={handleEmailSubmit} className="space-y-5 py-4">
                            <div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary transition"
                            >
                                Send Verification Link
                            </button>
                        </form>
                    </div>
                    {showMessage && (
                        <Message
                            {...messageData}
                            onClose={() => setShowMessage(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}