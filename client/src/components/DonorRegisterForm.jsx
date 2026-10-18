import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Message } from "./Message";
import { DonorFormInput } from "./DonorFormInput";

export const DonorRegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        companyName: "",
    });

    const [errors, setErrors] = useState({});
    const [showMessage, setShowMessage] = useState(false);

    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        let error = "";

        if (name === "name") {
            if (!value.trim()) {
                error = "Full name is required";
            } else if (!/^[A-Za-z\s]+$/.test(value)) {
                error = "Name should contain only letters";
            }
        }

        if (name === "email") {
            if (!value.trim()) {
                error = "Email is required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = "Enter a valid email address";
            }
        }

        if (name === "phoneNumber") {
            if (!value.trim()) {
                error = "Phone number is required";
            } else if (!/^[0-9]{10}$/.test(value)) {
                error = "Phone number must be 10 digits";
            }
        }

        if (name === "password") {
            if (!value) {
                error = "Password is required";
            } else if (value.length < 8) {
                error = "Password must be at least 8 characters";
            } else if (!/[A-Z]/.test(value)) {
                error = "Password must contain uppercase";
            } else if (!/[a-z]/.test(value)) {
                error = "Password must contain lowercase";
            } else if (!/[0-9]/.test(value)) {
                error = "Password must contain number";
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch("/api/auth/register-donor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Registration Successful",
                    message:
                        "Welcome to HungerBridge. We've sent a verification link to your email. Please verify your email address before signing in.",
                });

                setShowMessage(true);

                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    companyName: "",
                });

                setErrors({});
                setShowPassword(false);
            } else {
                setMessageData({
                    type: "error",
                    title: "Registration Failed",
                    message: data.message,
                });

                setShowMessage(true);
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Registration Failed",
                message: "Something went wrong. Please try again.",
            });

            setShowMessage(true);
        }
    };

    return (
        <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-brown px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div
                className="flex w-full max-w-3xl min-w-0 flex-col gap-5 rounded-2xl border border-white/20 bg-background/20 p-5 text-inactive shadow-xl transition-all duration-300 hover:border-secondary/30 hover:shadow-[0_0_3px_#FFFB97] sm:gap-6 sm:p-8 md:p-10 lg:p-12"
            >
                <NavLink
                    to="/register"
                    className="flex w-fit items-center gap-2 text-base font-bold text-primary/80 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:text-lg"
                >
                    <ArrowLeft strokeWidth={3.5} size={20} />
                    Back
                </NavLink>

                <div className="flex min-w-0 flex-col gap-2">
                    <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
                        Donor Details
                    </h1>

                    <p className="max-w-xl font-body text-sm leading-6 text-inactive/70 sm:text-base sm:leading-7">
                        Set up your personal or organizational donor account.
                    </p>
                </div>

                <form
                    className="flex min-w-0 flex-col gap-5 sm:gap-6"
                    onSubmit={handleSubmit}
                >
                    {/* Name and Email */}
                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        <DonorFormInput
                            label="Full Name"
                            name="name"
                            type="text"
                            placeholder="Zoya khan"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            required
                        />

                        <DonorFormInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="zoya@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            required
                        />
                    </div>

                    {/* Phone and Organization */}
                    <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        <DonorFormInput
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            placeholder="0000000000"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                            required
                        />

                        <DonorFormInput
                            label="Organization Name"
                            name="companyName"
                            type="text"
                            placeholder="none"
                            value={formData.companyName}
                            onChange={handleChange}
                            error={errors.companyName}
                        />
                    </div>

                    {/* Password */}
                    <div className="min-w-0">
                        <div className="relative">
                            <DonorFormInput
                                label="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((prev) => !prev)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3 top-9 flex items-center justify-center rounded-md p-1 text-inactive transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-4"
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="mt-1 w-full rounded-xl border border-white/20 bg-primary px-5 py-3 text-base font-bold text-background shadow-lg shadow-primary/30 transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brown active:scale-[0.99] sm:py-3.5 sm:text-lg"
                    >
                        Complete Registration
                    </button>
                </form>
            </div>

            {showMessage && (
                <Message
                    {...messageData}
                    onClose={() => setShowMessage(false)}
                />
            )}
        </main>
    );
};