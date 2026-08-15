import { ArrowLeft } from "lucide-react";
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom";
import { Message } from "../components/Message";
import { Eye, EyeOff } from "lucide-react";
export const Login = () => {
    const navigate = useNavigate();
    const [verificationEmail, setVerificationEmail] = useState("");
    const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
    const [showPassword,setShowPassword]=useState(false)
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    })
    const handleChange = (event) => {
        const { name, value } = event.target;
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
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Login Successful",
                    message: data.message,
                });
                setShowMessage(true);
                setFormData({
                    identifier: "",
                    password: ""
                })
                if (data.role == "donor") {
                    navigate("/donor")
                }
                else if (data.role == "ngo") {
                    navigate("/ngo")
                }
                else if (data.role == "admin") {
                    navigate("/admin")
                }
                else {
                    setMessageData({
                        type: "error",
                        title: "Login Failed",
                        message: "Please try again later.",
                    });
                    setShowMessage(true);
                }
            }
            else if (data.code == "EMAIL_NOT_VERIFIED") {
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
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
        }
    }
    return (
        <div className="bg-brown py-12">
            <div className="relative z-10">
                <div className="flex flex-row justify-between items-center px-24 py-16">
                    <div className="flex flex-col justify-center items-center gap-5 w-[40%] p-4">
                        <div className=" bg-background/30 backdrop-blur-3xl px-4 py-1 rounded-[20px] w-max 
                        border border-white/20 shadow-xl shadow-black/10">
                            <h4 className="text-secondary font-body font-bold">
                                Welcome Back to HungerBridge
                            </h4>
                        </div>
                        <div className="font-heading font-extrabold text-6xl text-inactive">
                            <h1 className="leading-[1.3]">
                                <span>Bridging</span>
                                <span> Surplus</span>
                                <span className="text-secondary"> to Sustenance </span>
                            </h1>
                        </div>
                        <h3 className="font-body font-medium text-inactive">
                            Join our mission to eliminate hunger through innovative
                            logistics and community-driven action.
                        </h3>
                    </div>
                    <div className="flex flex-col gap-4 justify-center text-inactive p-12
            bg-background/20 rounded-[20px] min-w-[300px] max-w-fit
            border border border-primary/20 shadow-xl transition-all duration-300 
            hover:border-secondary/30 hover:-translate-y-2 hover:shadow-[0_0_3px_#FFFB97] hover:backdrop-blur-xl">
                        <NavLink to="/register" className="text-primary/90 text-lg font-body font-bold flex items-center gap-2 cursor-pointer">
                            <ArrowLeft strokeWidth={3.5} size={20} /> Back
                        </NavLink>
                        <div className="flex flex-col gap-1">
                            <div className="font-heading font-bold text-4xl ">
                                Sign In
                            </div>
                            <div className="font-body text-medium text-inactive/70">
                                Sign into your personal or organizational account.
                            </div>
                        </div>
                        <div className="py-4">
                            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                                <div className="flex flex-col gap-1 ">
                                    <label className="font-heading text-md text-inactive font-bold" htmlFor="identifier" >Email or Phone Number</label>
                                    <input className=" text-inactive px-4 py-3 bg-background/20
                                     backdrop-blur-xl rounded-[8px] w-full border 
                                    border border-cta/20 shadow-xl shadow-black/10"
                                        type="text" id="identifier" name="identifier" placeholder="zoyaxxx@gmail.com"
                                        onChange={handleChange} value={formData.identifier} required
                                    />
                                </div>
                                <div className="flex flex-col gap-1 flex-1">
                                    <label className="font-heading text-md text-inactive font-bold" htmlFor="password" >Password</label>
                                    <div className="relative">
                                        <input
                                            className="text-inactive px-4 py-3 pr-12 bg-background/20
                                             backdrop-blur-xl rounded-[8px] w-full border
                                            border-cta/20 shadow-xl shadow-black/10"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="***********"
                                            onChange={handleChange}
                                            value={formData.password}
                                            required
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2
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
                                        LogIn
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="flex gap-1 flex-1 justify-between">
                            <NavLink className="font-bold text-inactive 
                                hover:text-cta/80 transition-all duration-300" to="/forget-password">Forgot Password ?</NavLink>
                            {needsEmailVerification && (
                                <NavLink className="font-bold text-inactive 
                                hover:text-cta/80 transition-all duration-300"
                                    state={{ currentEmail: verificationEmail }}
                                    to="/change-email">Change Email</NavLink>
                            )}
                        </div>
                        <div className="px-4 py-3 text-center
                        text-inactive/70 text-md font-medium">
                            Don't have an account?
                            <NavLink className="px-2 font-bold text-inactive underline decoration-2
                     hover:text-cta/80 transition-all duration-300" to="/register">Create Account</NavLink>
                        </div>
                    </div>
                </div>
                <div className="absolute z-0 ">
                    <div
                        className=" absolute bottom-50 -right-190 w-[200px] h-[200px] 
                    rounded-full bg-primary/30 blur-[90px]"
                    />
                    <div
                        className=" absolute bottom-70 -right-230 w-[200px] h-[200px] rounded-full bg-primary/45 blur-[90px]"
                    />
                </div>
            </div>
            {showMessage && (
                <Message
                    {...messageData}
                    onClose={() => setShowMessage(false)}
                />
            )}
        </div>
    )
}