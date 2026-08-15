import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Message } from "./Message";
import { NavLink } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { DonorFormInput } from "./DonorFormInput";
export const DonorRegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        companyName: ""
    })
    const [errors, setErrors] = useState({});
    const handleChange = (event) => {
        const { name, value } = event.target;
        let error = ""
        if (name === "name") {
            if (!value.trim()) {
                error = "Full name is required";
            }
            else if (!/^[A-Za-z\s]+$/.test(value)) {
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
            }
            else if (!/^[0-9]{10}$/.test(value)) {
                error = "Phone number must be 10 digits";
            }
        }

        if (name === "password") {
            if (!value) {
                error = "Password is required";
            } else if (value.length < 8) {
                error = "Password must be at least 8 characters";
            }
            else if (!/[A-Z]/.test(value)) {
                error = "Password must contain uppercase";
            }

            else if (!/[a-z]/.test(value)) {
                error = "Password must contain lowercase";
            }

            else if (!/[0-9]/.test(value)) {
                error = "Password must contain number";
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));
        setFormData(prev => (
            {
                ...prev,
                [name]: value
            }
        ))
    }
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });
    const handleSubmit = async (event) => {
        event.preventDefault()
        console.log("formSubmitted", formData)
        try {
            const res = await fetch("/api/auth/register-donor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Registration Successful",
                    message: "Welcome to HungerBridge.We've sent a verification link to your email. Please verify your email address before signing in.",
                });
                setShowMessage(true);
                setFormData({
                    name: "",
                    email: "",
                    phoneNumber: "",
                    password: "",
                    companyName: ""
                })
            } else {
                setMessageData({
                    type: "error",
                    title: "Registration Failed",
                    message: data.message,
                });
                setShowMessage(true);
                console.log(setMessageData)
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Registration Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
            console.log(setMessageData)
        }
    }
    return (
        <div className="bg-brown flex items-center justify-center py-8">
            <div className="flex flex-col gap-4 justify-center text-inactive p-12
            bg-background/20 rounded-[20px] min-w-[300px] max-w-fit
            border border border-white/20 shadow-xl transition-all duration-300 
            hover:border-secondary/30 hover:-translate-y-2 hover:shadow-[0_0_3px_#FFFB97] hover:backdrop-blur-xl">
                <NavLink to="/register" className="text-primary/80 text-lg font-body font-bold flex items-center gap-2 cursor-pointer">
                    <ArrowLeft strokeWidth={3.5} size={20} /> Back
                </NavLink>
                <div className="flex flex-col gap-1">
                    <div className="font-heading font-bold text-4xl ">
                        Donor Details
                    </div>
                    <div className="font-body text-medium text-inactive/70">
                        Set up your personal or organizational donor account.
                    </div>
                </div>
                <div className="py-4">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div className="flex flex-row gap-4">
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
                        <div className="flex flex-row gap-4">
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
                        <div className="flex flex-col gap-1 flex-1">
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
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 translate-y-1
                                    text-inactive hover:text-primary cursor-pointer"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <button type="submit"
                                className="inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50
                            bg-primary border border-white/20 text-background rounded-[10px] text-xl font-bold
                            cursor-pointer">
                                Complete Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showMessage && (
                <Message
                    {...messageData}
                    onClose={() => setShowMessage(false)}
                />
            )}
        </div >
    )
}