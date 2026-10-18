import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Message } from "../components/Message";

export const Login = () => {
    const navigate = useNavigate();

    const [verificationEmail, setVerificationEmail] = useState("");
    const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const [showMessage, setShowMessage] = useState(false);

    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Login Successful",
                    message: data.message,
                });

                setShowMessage(true);

                setFormData({
                    identifier: "",
                    password: "",
                });

                if (data.role === "donor") {
                    navigate("/donor/dashboard");
                } else if (data.role === "ngo") {
                    navigate("/ngo");
                } else if (data.role === "delivery_partner") {
                    navigate("/delivery");
                } else if (data.role === "admin") {
                    navigate("/admin");
                } else {
                    setMessageData({
                        type: "error",
                        title: "Login Failed",
                        message: "Please try again later.",
                    });

                    setShowMessage(true);
                }
            } else if (data.code === "EMAIL_NOT_VERIFIED") {
                setVerificationEmail(data.email);
                setNeedsEmailVerification(true);

                setMessageData({
                    type: "error",
                    title: "Login Failed",
                    message: data.message,
                });

                setShowMessage(true);
            } else {
                setMessageData({
                    type: "error",
                    title: "Login Failed",
                    message: data.message,
                });

                setShowMessage(true);
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Login Failed",
                message: "Something went wrong. Please try again.",
            });

            setShowMessage(true);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-brown px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            {/* Background glow effects */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="absolute -right-20 top-20 h-40 w-40 rounded-full bg-primary/30 blur-[90px] sm:-right-10 sm:h-52 sm:w-52" />
                <div className="absolute -bottom-10 -left-20 h-40 w-40 rounded-full bg-primary/30 blur-[90px] sm:h-52 sm:w-52" />
                <div className="absolute bottom-1/4 right-0 h-40 w-40 rounded-full bg-primary/20 blur-[90px] sm:-right-10 sm:h-52 sm:w-52" />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 xl:gap-16">
                {/* Welcome section */}
                <section className="flex w-full min-w-0 flex-col items-center gap-4 text-center sm:gap-5 lg:w-[48%] lg:items-start lg:text-left">
                    <div className="max-w-full rounded-full border border-white/20 bg-background/30 px-3 py-2 shadow-xl shadow-black/10 backdrop-blur-3xl sm:px-4">
                        <h4 className="break-words font-body text-xs font-bold text-secondary sm:text-sm">
                            Welcome Back to HungerBridge
                        </h4>
                    </div>

                    <h1 className="font-heading text-4xl font-extrabold leading-tight text-inactive sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                        <span className="block">Bridging</span>
                        <span className="block">Surplus</span>
                        <span className="block text-secondary">
                            to Sustenance
                        </span>
                    </h1>

                    <h3 className="max-w-xl font-body text-sm font-medium leading-6 text-inactive sm:text-base sm:leading-7">
                        Join our mission to eliminate hunger through innovative
                        logistics and community-driven action.
                    </h3>
                </section>

                {/* Login form */}
                <section className="w-full min-w-0 max-w-lg rounded-2xl border border-primary/20 bg-background/20 p-5 text-inactive shadow-xl transition-all duration-300 hover:border-secondary/30 hover:shadow-[0_0_3px_#FFFB97] hover:backdrop-blur-xl sm:p-8 md:p-10 lg:w-[48%] lg:max-w-xl">
                    <NavLink
                        to="/register"
                        className="inline-flex items-center gap-2 text-base font-bold text-primary/90 transition-colors hover:text-secondary sm:text-lg"
                    >
                        <ArrowLeft strokeWidth={3.5} size={20} />
                        Back
                    </NavLink>

                    <div className="mt-6">
                        <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                            Sign In
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-inactive/70 sm:text-base">
                            Sign into your personal or organizational account.
                        </p>
                    </div>

                    <form
                        className="mt-6 flex min-w-0 flex-col gap-5 sm:mt-8"
                        onSubmit={handleSubmit}
                    >
                        {/* Email or phone */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                className="font-heading text-sm font-bold text-inactive sm:text-base"
                                htmlFor="identifier"
                            >
                                Email or Phone Number
                            </label>

                            <input
                                className="w-full min-w-0 rounded-lg border border-cta/20 bg-background/20 px-3 py-3 text-base text-inactive shadow-xl shadow-black/10 outline-none backdrop-blur-xl transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:px-4"
                                type="text"
                                id="identifier"
                                name="identifier"
                                placeholder="zoyaxxx@gmail.com"
                                onChange={handleChange}
                                value={formData.identifier}
                                autoComplete="username"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex min-w-0 flex-col gap-2">
                            <label
                                className="font-heading text-sm font-bold text-inactive sm:text-base"
                                htmlFor="password"
                            >
                                Password
                            </label>

                            <div className="relative min-w-0">
                                <input
                                    className="w-full min-w-0 rounded-lg border border-cta/20 bg-background/20 px-3 py-3 pr-12 text-base text-inactive shadow-xl shadow-black/10 outline-none backdrop-blur-xl transition focus:border-secondary focus:ring-2 focus:ring-secondary/20 sm:px-4 sm:pr-12"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="***********"
                                    onChange={handleChange}
                                    value={formData.password}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={
                                        showPassword ? "Hide password" : "Show password"
                                    }
                                    aria-pressed={showPassword}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-inactive transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary/50 sm:right-4"
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
                            className="w-full rounded-lg border border-white/20 bg-primary px-5 py-3 text-base font-bold text-background shadow-[0_4px_20px] shadow-primary/50 transition duration-300 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 sm:py-3.5 sm:text-lg"
                        >
                            Log In
                        </button>
                    </form>

                    {/* Password recovery and email verification */}
                    <div className="mt-5 flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                        <NavLink
                            className="font-bold text-inactive transition-colors hover:text-cta/80"
                            to="/forget-password"
                        >
                            Forgot Password?
                        </NavLink>

                        {needsEmailVerification && (
                            <NavLink
                                className="font-bold text-inactive transition-colors hover:text-cta/80"
                                state={{ currentEmail: verificationEmail }}
                                to="/change-email"
                            >
                                Change Email
                            </NavLink>
                        )}
                    </div>

                    {/* Registration link */}
                    <div className="mt-6 border-t border-white/10 px-1 pt-5 text-center text-sm leading-6 text-inactive/70 sm:text-base">
                        <span>Don't have an account?</span>

                        <NavLink
                            className="ml-2 inline-block font-bold text-inactive underline decoration-2 underline-offset-4 transition-colors hover:text-cta/80"
                            to="/register"
                        >
                            Create Account
                        </NavLink>
                    </div>
                </section>
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