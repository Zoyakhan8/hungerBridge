
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
    <main className="min-h-screen bg-emerald-50 px-4 py-10">
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="bg-emerald-800 px-6 py-8 text-white">
          <p className="text-sm font-semibold tracking-widest">
            HUNGERBRIDGE
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Become a Delivery Partner
          </h1>
          <p className="mt-2 text-sm text-emerald-100">
            Help deliver surplus food safely to people who need it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
            >
              {success}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Full name *
            </label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-700"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email address *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-700"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Phone number *
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-emerald-700"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Vehicle type *
            </label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
            >
              <option value="bike">Motorcycle / Scooter</option>
              <option value="bicycle">Bicycle</option>
              <option value="car">Car</option>
              <option value="van">Van</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Vehicle registration number
            </label>
            <input
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="e.g. MH01AB1234"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Confirm password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
              placeholder="Enter your password again"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-800 px-4 py-3 font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
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
