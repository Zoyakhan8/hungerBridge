import { ArrowLeft } from "lucide-react";
import { NgoDetails } from "./steps/NgoDetails";
import { NgoAccountSetup } from "./steps/NgoAccountSetup";
import { NgoDocuments } from "./steps/NgoDocuments";
import { useState } from "react";
import { steps } from "../utils/steps";
import { Message } from "./Message";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
export const NgoRegisterForm = () => {
    const [formData, setFormData] = useState({
        organizationName: "",
        registeredNumber: "",
        registeredAddress: "",
        registrationDocument: null,
        panCard: null,
        addressProof: null,
        email: "",
        phoneNumber: "",
        password: "",
        docDeclaration: false,
        termsDeclaration: false
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "organizationName":
                if (!value.trim()) {
                    error = "Organization name is required";
                }
                break;

            case "registeredNumber":
                if (!value.trim()) {
                    error = "Registered number is required";
                }
                break;

            case "registeredAddress":
                if (!value.trim()) {
                    error = "Registered address is required";
                }
                else if (value.trim().length < 10) {
                    error = "Enter a complete address";
                }
                break;
            case "registrationDocument":
                if (!value) {
                    error = "Document is required";
                } else {
                    const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "application/pdf"
                    ];

                    if (!allowedTypes.includes(value.type)) {
                        error = "Only PNG, JPG, and PDF files are allowed";
                    }
                }
                break;
            case "panCard":
                if (!value) {
                    error = "Document is required";
                } else {
                    const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "application/pdf"
                    ];

                    if (!allowedTypes.includes(value.type)) {
                        error = "Only PNG, JPG, and PDF files are allowed";
                    }
                }
                break;
            case "addressProof":
                if (!value) {
                    error = "Document is required";
                } else {
                    const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "application/pdf"
                    ];

                    if (!allowedTypes.includes(value.type)) {
                        error = "Only PNG, JPG, and PDF files are allowed";
                    }
                }
                break;
            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ) {
                    error = "Enter a valid email address";
                }
                break;

            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (
                    !/^[0-9]{10}$/.test(value)
                ) {
                    error = "Phone number must be in 10 digits";
                }
                break;

            case "password":

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
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error
        }));

        return !error;
    };
    const handleChange = (event) => {
        const { name, value, type, checked, files } = event.target;

        if (type === "file") {
            const file = files?.[0] || null;

            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
            ];

            setTouched((prev) => ({
                ...prev,
                [name]: true,
            }));

            if (!file) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: null,
                }));

                validateField(name, null);
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: null,
                }));

                validateField(name, file);
                return;
            }

            setFormData((prev) => ({
                ...prev,
                [name]: file,
            }));

            validateField(name, file);
            return;
        }

        const newValue =
            type === "checkbox"
                ? checked
                : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        validateField(name, newValue);
    };
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        for (const [key, value] of data.entries()) {
            console.log(key, value);
        }
        try {
            const res = await fetch("/api/auth/register-ngo", {
                method: "POST",
                body: data
            });
            const result = await res.json();
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Registration Successful",
                    message: result.message,
                });
                setShowMessage(true);
                setFormData({
                    organizationName: "",
                    registeredNumber: "",
                    registeredAddress: "",
                    registrationDocument: null,
                    panCard: null,
                    addressProof: null,
                    email: "",
                    phoneNumber: "",
                    password: "",
                    docDeclaration: false,
                    termsDeclaration: false
                })
            } else {
                setMessageData({
                    type: "error",
                    title: "Registration Failed",
                    message: result.message,
                });
                setShowMessage(true);
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Registration Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
        }
    };
    const [step, setStep] = useState(1);
    const stepComponents = [
        <NgoDetails
            formData={formData}
            handleChange={handleChange}
            errors={errors}
        />,
        <NgoDocuments
            formData={formData}
            handleChange={handleChange}
            errors={errors} />,
        <NgoAccountSetup
            formData={formData}
            handleChange={handleChange}
            errors={errors} />
    ];
    const formRef = useRef(null);
    const nextStep = () => {
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }
        if (step < steps.length) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    const goToStep = (targetStep) => {
        if (targetStep < step) {
            setStep(targetStep);
            return;
        }
        if (targetStep > step + 1) {
            return;
        }
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }
        setStep(targetStep);
    };
    return (
        <div className="bg-brown flex items-center justify-center py-8">
            <div className="flex flex-col gap-6 justify-center text-inactive p-10
            bg-background/20 rounded-[20px] min-w-[300px] max-w-[650px]
            border border border-white/20 shadow-xl transition-all duration-300 
            hover:border-secondary/30 hover:-translate-y-2 hover:shadow-[0_0_3px_#FFFB97] hover:backdrop-blur-xl">
                <div className="text-inactive text-lg font-body font-bold flex justify-between items-center gap-2 ">
                    <div className="flex gap-2">
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                onClick={() => goToStep(index + 1)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                                ${step === index + 1
                                        ? "bg-primary text-background"
                                        : "bg-background text-inactive"
                                    }`}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <div>
                        <div>Step {step} of {steps.length}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-heading font-bold text-4xl ">
                        {steps[step - 1].title}
                    </div>
                    <div className="font-body text-medium text-inactive/70">
                        {steps[step - 1].text}
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3" ref={formRef}>
                    {stepComponents[step - 1]}
                    <div className="flex items-center justify-between gap-2 flex-1">
                        {step == 1 ? (<NavLink
                            to="/register"
                            className="inline-block bg-background/30 backdrop-blur-3xl
                            px-10 py-3 border border-white/20 text-inactive
                            rounded-[10px] text-md font-bold
                            hover:scale-105
                            transition-transform duration-300
                            shadow-[0_10px_25px_rgba(0,0,0,0.2)]"
                        >
                            Cancel
                        </NavLink>) : (<button
                            type="button"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="inline-block bg-background/30 backdrop-blur-3xl px-10 py-3
                            border border-white/20 text-inactive rounded-[10px] text-md font-bold
                            hover:scale-105 transition-all duration-300 shadow-[-10px_0_25px_rgba(0,0,0,0.2)]"
                        >
                            Previous
                        </button>)}

                        <button
                            type={step === steps.length ? "submit" : "button"}
                            onClick={step === steps.length ? undefined : nextStep}
                            className="inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50
                            bg-primary border border-white/20 text-background rounded-[10px] text-md font-bold
                            cursor-pointer"
                        >
                            {step === steps.length ? "Submit For Verification" : "Next Step"}
                        </button>
                    </div>
                </form>
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