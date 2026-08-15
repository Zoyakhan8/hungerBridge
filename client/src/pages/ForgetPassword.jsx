import { useState } from "react";
import { Message } from "../components/Message";

export const ForgetPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otpData, setOtpData] = useState("");
    const [passwordData, setPasswordData] = useState("");
    const [confirmPasswordData, setConfirmPasswordData] = useState("");
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
            const res = await fetch("/api/auth/forget-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Email Verify Successfully",
                    message: data.message,
                });
                setShowMessage(true);
                setStep(2);
            } else {
                setMessageData({
                    type: "error",
                    title: "Email Verification Failed",
                    message: data.message,
                });
                setShowMessage(true);
                console.log(setMessageData)
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Email Verification Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
            console.log(setMessageData)
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault()
        console.log("formSubmitted", otpData)
        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpData })
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "OTP Verify Successfully",
                    message: data.message,
                });
                setShowMessage(true);
                setOtpData("")
                setStep(3);
            } else {
                setMessageData({
                    type: "error",
                    title: "OTP Verification Failed",
                    message: data.message,
                });
                setShowMessage(true);
                console.log(setMessageData)
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "OTP Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
            console.log(setMessageData)
        }
    };

    const handlePasswordSubmit = async (event) => {
        event.preventDefault()
        if (passwordData !== confirmPasswordData) {
            alert("Passwords do not match");
            return;
        }
        console.log("formSubmitted", otpData)
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: passwordData })
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Reset Password Successfully",
                    message: data.message,
                });
                setShowMessage(true);
                setOtpData("")
            } else {
                setMessageData({
                    type: "error",
                    title: "Reset Password Failed",
                    message: data.message,
                });
                setShowMessage(true);
                console.log(setMessageData)
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Reset Password Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
            console.log(setMessageData)
        }
    };

    return (
        <div className="bg-brown">
            <div className="min-h-screen bg-brown-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md  rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Reset Password
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {step === 1 && "Enter your email to receive an OTP"}
                            {step === 2 && "Enter the OTP sent to your email"}
                            {step === 3 && "Create your new password"}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mb-8">

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${step >= 1
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                1
                            </div>
                            <span className="text-xs mt-2 text-gray-500">Email</span>
                        </div>

                        <div className="flex-1 h-1 mx-3 bg-gray-200">
                            <div
                                className={`h-full transition-all duration-300 ${step >= 2 ? "bg-primary w-full" : "w-0"
                                    }`}
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${step >= 2
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                2
                            </div>
                            <span className="text-xs mt-2 text-gray-500">OTP</span>
                        </div>

                        <div className="flex-1 h-1 mx-3 bg-gray-200">
                            <div
                                className={`h-full transition-all duration-300 ${step >= 3 ? "bg-primary w-full" : "w-0"
                                    }`}
                            />
                        </div>

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${step >= 3
                                    ? "bg-primary text-white"
                                    : "bg-gray-200 text-gray-500"
                                    }`}
                            >
                                3
                            </div>
                            <span className="text-xs mt-2 text-gray-500">Password</span>
                        </div>
                    </div>

                    {/* STEP 1 — EMAIL */}
                    {step === 1 && (
                        <form onSubmit={handleEmailSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email address
                                </label>

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
                                Send OTP
                            </button>
                        </form>
                    )}

                    {/* STEP 2 — OTP */}
                    {step === 2 && (
                        <form onSubmit={handleOtpSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Verification Code
                                </label>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    value={otpData}
                                    onChange={(e) => setOtpData(e.target.value)}
                                    placeholder="Enter 6-digit OTP"
                                    required
                                    className="w-full px-4 py-3 text-center tracking-[0.5em] text-xl border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <p className="text-sm text-gray-500 mt-3 text-center">
                                    OTP sent to <span className="font-medium">{email}</span>
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary transition"
                            >
                                Verify OTP
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-secondary hover:underline"
                            >
                                Change email
                            </button>
                        </form>
                    )}

                    {/* STEP 3 — PASSWORD */}
                    {step === 3 && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New password
                                </label>

                                <input
                                    type="password"
                                    value={passwordData}
                                    onChange={(e) => setPasswordData(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm password
                                </label>

                                <input
                                    type="password"
                                    value={confirmPasswordData}
                                    onChange={(e) => setConfirmPasswordData(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary transition"
                            >
                                Reset Password
                            </button>
                        </form>
                    )}
                    {showMessage && (
                        <Message
                            {...messageData}
                            onClose={() => setShowMessage(false)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};