
import { useState } from "react";

const initialFormData = {
    name: "",
    email: "",
    phoneNumber: "",
    category: "General Inquiry",
    subject: "",
    message: "",
};

export const Contact = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState({
        type: "",
        message: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setFeedback({ type: "", message: "" });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/contact-us", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.errors
                        ? Object.values(data.errors).flat().join(", ")
                        : data.message || "Failed to submit your message."
                );
            }

            alert(data.message || "Message submitted successfully.");

            setFormData({
                name: "",
                email: "",
                phoneNumber: "",
                category: "General Inquiry",
                subject: "",
                message: "",
            });
        } catch (error) {
            console.error("Contact form error:", error);
            alert(error.message || "Unable to submit your message.");
        }
    };


    const inputClass =
        "w-full rounded-[8px] border border-cta/40 bg-background/20 px-4 py-3 text-inactive shadow-xl shadow-black/10 backdrop-blur-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-inactive/50";

    const labelClass =
        "font-heading text-md font-bold text-inactive";

    return (
        <section className="relative isolate overflow-hidden bg-brown">
            {/* Background glow — same visual style as your original page */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-20 -z-0 h-64 w-64 rounded-full bg-primary/20 blur-[100px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-20 bottom-10 -z-0 h-64 w-64 rounded-full bg-primary/15 blur-[100px]"
            />

            <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.95fr] lg:gap-14 lg:px-12 lg:py-20">

                {/* Left: Introduction and contact information */}
                <div className="flex min-w-0 flex-col gap-6">
                    <div className="w-fit rounded-[20px] border border-white/20 bg-background/30 px-4 py-1 shadow-xl shadow-black/10 backdrop-blur-3xl">
                        <h4 className="font-body font-bold text-secondary">
                            . Academic Project
                        </h4>
                    </div>

                    <h1 className="font-heading text-4xl font-extrabold leading-[1.15] text-inactive sm:text-5xl lg:text-6xl">
                        Illuminating the Path to Zero Hunger
                    </h1>

                    <p className="max-w-xl font-body text-base font-medium leading-relaxed text-inactive sm:text-lg">
                        Building a safer future for food donation starts
                        with a conversation. Whether you're an NGO, donor,
                        delivery partner, or simply interested in HungerBridge,
                        we'd love to hear from you.
                    </p>

                    {/* Contact information cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex min-w-0 flex-col gap-2 rounded-[20px] border border-white/20 bg-background/20 px-5 py-6 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:border-white/30 hover:scale-[1.02]">
                            <h2 className="font-body text-xl font-bold text-heading">
                                Inquiries
                            </h2>
                            <p className="break-words font-body text-sm leading-relaxed text-inactive">
                                hungerbridge@gmail.com
                            </p>
                            <p className="font-body text-sm text-inactive">
                                +910000000
                            </p>
                        </div>

                        <div className="flex min-w-0 flex-col gap-2 rounded-[20px] border border-white/20 bg-background/20 px-5 py-6 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:border-white/30 hover:scale-[1.02]">
                            <h2 className="font-body text-xl font-bold text-heading">
                                Location
                            </h2>
                            <p className="font-body text-sm leading-relaxed text-inactive">
                                Mumbai, Maharashtra
                                <br />
                                India
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-background/10 px-5 py-4">
                        <p className="font-body text-sm leading-relaxed text-inactive/90">
                            Have an issue with a donation, delivery, or your
                            account? Choose the appropriate request type in
                            the form, and our team can review it.
                        </p>
                    </div>
                </div>

                {/* Right: Original glass-style form */}
                <div className="min-w-0 rounded-[20px] border border-white/20 bg-background/20 p-5 shadow-xl shadow-black/10 backdrop-blur-xl transition duration-300 hover:border-white/30 sm:p-8 lg:p-10">
                    <h2 className="font-heading text-3xl font-extrabold text-inactive sm:text-4xl">
                        Send a Message
                    </h2>

                    <p className="mb-5 mt-2 font-body text-sm leading-relaxed text-inactive/80">
                        Share an inquiry, report a problem, or send us feedback.
                    </p>

                    {feedback.message && (
                        <div
                            role="status"
                            aria-live="polite"
                            className={`mb-5 rounded-lg border p-3 font-body text-sm ${feedback.type === "success"
                                    ? "border-green-400/40 bg-background/20 text-inactive"
                                    : "border-red-400/40 bg-background/20 text-inactive"
                                }`}
                        >
                            {feedback.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex min-w-0 flex-col gap-2">
                                <label className={labelClass} htmlFor="name">
                                    Full Name *
                                </label>
                                <input
                                    className={inputClass}
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    maxLength={100}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="flex min-w-0 flex-col gap-2">
                                <label className={labelClass} htmlFor="email">
                                    Email *
                                </label>
                                <input
                                    className={inputClass}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    maxLength={254}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={labelClass} htmlFor="phoneNumber">
                                Phone Number
                            </label>
                            <input
                                className={inputClass}
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Enter your number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                maxLength={20}
                                autoComplete="tel"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={labelClass} htmlFor="category">
                                Request Type *
                            </label>
                            <select
                                className={inputClass}
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Complaint">Complaint</option>
                                <option value="Technical Issue">Technical Issue</option>
                                <option value="Donation Issue">Donation Issue</option>
                                <option value="Delivery Issue">Delivery Issue</option>
                                <option value="NGO Issue">NGO Issue</option>
                                <option value="Feedback">Feedback</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={labelClass} htmlFor="subject">
                                Subject *
                            </label>
                            <input
                                className={inputClass}
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Briefly describe your issue"
                                value={formData.subject}
                                onChange={handleChange}
                                maxLength={150}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={labelClass} htmlFor="message">
                                Message *
                            </label>
                            <textarea
                                className={`${inputClass} min-h-32 resize-y`}
                                id="message"
                                name="message"
                                placeholder="Enter your message..."
                                value={formData.message}
                                onChange={handleChange}
                                maxLength={3000}
                                rows={4}
                                required
                            />
                            <p className="text-right font-body text-xs text-inactive/70">
                                {formData.message.length}/3000
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-block cursor-pointer rounded-[10px] border border-white/40 bg-primary px-6 py-3 text-lg font-bold text-brown shadow-[0_4px_20px] shadow-primary/50 transition duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};
