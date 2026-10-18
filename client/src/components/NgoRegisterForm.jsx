import { ArrowLeft } from "lucide-react";
import { NgoDetails } from "./steps/NgoDetails";
import { NgoAccountSetup } from "./steps/NgoAccountSetup";
import { NgoDocuments } from "./steps/NgoDocuments";
import { useState, useRef } from "react";
import { steps } from "../utils/steps";
import { Message } from "./Message";
import { NavLink } from "react-router-dom";

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
        termsDeclaration: false,
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
                } else if (value.trim().length < 10) {
                    error = "Enter a complete address";
                }
                break;

            case "registrationDocument":
            case "panCard":
            case "addressProof":
                if (!value) {
                    error = "Document is required";
                } else {
                    const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "application/pdf",
                    ];

                    if (!allowedTypes.includes(value.type)) {
                        error = "Only PNG, JPG, and PDF files are allowed";
                    }
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Enter a valid email address";
                }
                break;

            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (!/^[0-9]{10}$/.test(value)) {
                    error = "Phone number must be in 10 digits";
                }
                break;

            case "password":
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
                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
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

        const newValue = type === "checkbox" ? checked : value;

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

        try {
            const res = await fetch("/api/auth/register-ngo", {
                method: "POST",
                body: data,
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
                    termsDeclaration: false,
                });

                setErrors({});
                setTouched({});
                setStep(1);
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
                message: "Something went wrong. Please try again.",
            });

            setShowMessage(true);
        }
    };

    const [step, setStep] = useState(1);

    const stepComponents = [
        <NgoDetails
            key="details"
            formData={formData}
            handleChange={handleChange}
            errors={errors}
        />,
        <NgoDocuments
            key="documents"
            formData={formData}
            handleChange={handleChange}
            errors={errors}
        />,
        <NgoAccountSetup
            key="account"
            formData={formData}
            handleChange={handleChange}
            errors={errors}
        />,
    ];

    const formRef = useRef(null);

    const nextStep = () => {
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return;
        }

        if (step < steps.length) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
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
        <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-brown px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
            <div className="flex w-full max-w-[650px] min-w-0 flex-col gap-5 rounded-2xl border border-white/20 bg-background/20 p-4 text-inactive shadow-xl transition-all duration-300 hover:border-secondary/30 hover:shadow-[0_0_3px_#FFFB97] sm:gap-6 sm:p-6 md:p-8 lg:p-10">
                {/* Step indicator */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        {steps.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => goToStep(index + 1)}
                                aria-label={`Go to step ${index + 1}`}
                                aria-current={
                                    step === index + 1 ? "step" : undefined
                                }
                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:h-11 sm:w-11 sm:text-base ${
                                    step === index + 1
                                        ? "bg-primary text-background"
                                        : "bg-background text-inactive"
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm font-bold sm:text-base">
                        Step {step} of {steps.length}
                    </p>
                </div>

                {/* Current step heading */}
                <div className="flex min-w-0 flex-col gap-2">
                    <h1 className="break-words font-heading text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
                        {steps[step - 1].title}
                    </h1>

                    <p className="break-words font-body text-sm leading-6 text-inactive/70 sm:text-base sm:leading-7">
                        {steps[step - 1].text}
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="flex min-w-0 flex-col gap-5 sm:gap-6"
                    ref={formRef}
                >
                    <div className="min-w-0">
                        {stepComponents[step - 1]}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex w-full flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        {step === 1 ? (
                            <NavLink
                                to="/register"
                                className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-background/30 px-5 py-3 text-sm font-bold text-inactive shadow-md transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:min-w-[120px] sm:text-base"
                            >
                                Cancel
                            </NavLink>
                        ) : (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-background/30 px-5 py-3 text-sm font-bold text-inactive shadow-md transition-transform duration-300 hover:scale-[1.02] sm:w-auto sm:min-w-[120px] sm:text-base"
                            >
                                Previous
                            </button>
                        )}

                        <button
                            type={step === steps.length ? "submit" : "button"}
                            onClick={
                                step === steps.length ? undefined : nextStep
                            }
                            className="flex w-full items-center justify-center rounded-xl border border-white/20 bg-primary px-5 py-3 text-sm font-bold text-background shadow-lg shadow-primary/30 transition-all duration-200 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brown sm:w-auto sm:min-w-[160px] sm:text-base"
                        >
                            {step === steps.length
                                ? "Submit For Verification"
                                : "Next Step"}
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
        </main>
    );
};