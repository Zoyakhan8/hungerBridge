import { useState } from "react";

const API_URL = "http://localhost:3000/api";

export default function DeliveryPartnerRegister() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        vehicleType: "bike",
        vehicleNumber: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/delivery/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fullName: form.fullName.trim(),
                        email: form.email.trim().toLowerCase(),
                        phoneNumber: form.phoneNumber.trim(),
                        vehicleType: form.vehicleType,
                        vehicleNumber: form.vehicleNumber.trim() || null,
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            setSuccess(
                data.message ||
                    "Account created! Please wait for admin verification."
            );

            setForm({
                fullName: "",
                email: "",
                phoneNumber: "",
                vehicleType: "bike",
                vehicleNumber: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(
                err.message || "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen overflow-x-hidden bg-emerald-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            <div className="mx-auto w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-lg sm:rounded-2xl">
                {/* Header */}
                <div className="bg-emerald-800 px-4 py-6 text-white sm:px-6 sm:py-8">
                    <p className="text-xs font-semibold tracking-[0.2em] sm:text-sm sm:tracking-widest">
                        HUNGERBRIDGE
                    </p>

                    <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                        Become a Delivery Partner
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-emerald-100">
                        Help deliver surplus food safely to people who need it.
                    </p>
                </div>

                {/* Registration form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-4 sm:p-6"
                >
                    {error && (
                        <div
                            role="alert"
                            className="break-words rounded-lg bg-red-50 p-3 text-sm leading-5 text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            role="status"
                            className="break-words rounded-lg bg-emerald-50 p-3 text-sm leading-5 text-emerald-800"
                        >
                            {success}
                        </div>
                    )}

                    <div className="min-w-0">
                        <label
                            htmlFor="fullName"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Full name *
                        </label>

                        <input
                            id="fullName"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Email address *
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="phoneNumber"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Phone number *
                        </label>

                        <input
                            id="phoneNumber"
                            type="tel"
                            name="phoneNumber"
                            value={form.phoneNumber}
                            onChange={handleChange}
                            required
                            autoComplete="tel"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="vehicleType"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Vehicle type *
                        </label>

                        <select
                            id="vehicleType"
                            name="vehicleType"
                            value={form.vehicleType}
                            onChange={handleChange}
                            required
                            className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                        >
                            <option value="bike">Motorcycle / Scooter</option>
                            <option value="bicycle">Bicycle</option>
                            <option value="car">Car</option>
                            <option value="van">Van</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="vehicleNumber"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Vehicle registration number
                        </label>

                        <input
                            id="vehicleNumber"
                            name="vehicleNumber"
                            value={form.vehicleNumber}
                            onChange={handleChange}
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="e.g. MH01AB1234"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Password *
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="At least 8 characters"
                        />
                    </div>

                    <div className="min-w-0">
                        <label
                            htmlFor="confirmPassword"
                            className="mb-1 block text-sm font-medium text-gray-800"
                        >
                            Confirm password *
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-base outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:py-2.5 sm:text-sm"
                            placeholder="Enter your password again"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-emerald-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-center text-xs leading-5 text-gray-500">
                        Accounts require admin verification before delivery
                        assignments can be received.
                    </p>
                </form>
            </div>
        </main>
    );
}
