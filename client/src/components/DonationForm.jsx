
import { useState } from "react";

const INITIAL_FORM_DATA = {
    foodName: "",
    foodType: "",
    quantity: "",
    storageHistory: "",
    ingredients: "",
    dateTime: "",
};

const FOOD_TYPES = [
    { value: "veg", label: "Veg", icon: "🌿" },
    { value: "non_veg", label: "Non-Veg", icon: "🍴" },
];

const STORAGE_OPTIONS = [
    { value: "room_temp", label: "Room Temperature" },
    { value: "refrigerator", label: "Refrigerated" },
    { value: "freezer", label: "Frozen" },
];

export const DonationForm = ({ onMessage }) => {
    const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const inputClass =
        "text-inactive px-4 py-3 bg-tertiary rounded-[4px] w-full border-b-3 border-primary/50 outline-none";

    const errorClass = "text-red-400 text-sm";

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.foodName.trim()) {
            newErrors.foodName = "Food name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(formData.foodName.trim())) {
            newErrors.foodName =
                "Food name should contain letters and spaces only.";
        }

        if (!formData.foodType) {
            newErrors.foodType = "Please select a food type.";
        } else if (!["veg", "non_veg"].includes(formData.foodType)) {
            newErrors.foodType = "Please select a valid food type.";
        }

        const quantity = Number(formData.quantity);

        if (
            formData.quantity === "" ||
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {
            newErrors.quantity = "Enter a quantity greater than zero.";
        }

        if (
            !["room_temp", "refrigerator", "freezer"].includes(
                formData.storageHistory
            )
        ) {
            newErrors.storageHistory = "Please select storage history.";
        }

        const ingredients = formData.ingredients
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

        if (ingredients.length === 0) {
            newErrors.ingredients = "Enter at least one ingredient.";
        }

        if (!formData.dateTime) {
            newErrors.dateTime =
                "Preparation date and time are required.";
        } else {
            const preparedAt = new Date(formData.dateTime);

            if (Number.isNaN(preparedAt.getTime())) {
                newErrors.dateTime = "Enter a valid preparation date.";
            } else if (preparedAt > new Date()) {
                newErrors.dateTime =
                    "Preparation time cannot be in the future.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting || !validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                foodName: formData.foodName.trim(),
                foodType: formData.foodType,
                quantity: Number(formData.quantity),
                storageHistory: formData.storageHistory,
                ingredients: formData.ingredients
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                dateTime: formData.dateTime,
            };

            console.log("Submitting donation:", payload);

            const response = await fetch(
                "/api/donor/create-donation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json().catch(() => ({}));

            console.log(
                "Create donation response:",
                response.status,
                data
            );

            if (!response.ok || data.success === false) {
                onMessage({
                    type: "error",
                    title: "Donation Failed",
                    message:
                        data.message ||
                        "Unable to register your donation. Please try again.",
                });
                return;
            }

            onMessage({
                type: "success",
                title: "Donation Registered",
                message:
                    data.message ||
                    "Your donation has been registered successfully.",
            });

            setFormData({ ...INITIAL_FORM_DATA });
            setErrors({});
        } catch (error) {
            console.error("Create donation error:", error);

            onMessage({
                type: "error",
                title: "Donation Failed",
                message:
                    "Unable to connect to the server. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit}
            noValidate
        >
            {/* Food Name */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="foodName"
                    className="font-app-body text-md text-inactive font-medium"
                >
                    Food Name
                </label>

                <input
                    id="foodName"
                    name="foodName"
                    type="text"
                    placeholder="E.g. Veg Thali"
                    value={formData.foodName}
                    onChange={handleChange}
                    className={inputClass}
                    required
                />

                {errors.foodName && (
                    <span className={errorClass}>
                        {errors.foodName}
                    </span>
                )}
            </div>

            {/* Food Type */}
            <div className="flex flex-col gap-1">
                <p className="font-app-body text-md text-inactive font-medium">
                    Food Type
                </p>

                <div className="flex gap-2">
                    {FOOD_TYPES.map((type) => (
                        <label
                            key={type.value}
                            className={`flex flex-1 font-app-body font-bold cursor-pointer items-center justify-center gap-2 rounded-lg border-2 py-2 transition ${
                                formData.foodType === type.value
                                    ? "border-primary bg-primary/40 text-secondary/70"
                                    : "border-gray-200 bg-brown hover:border-primary text-heading"
                            }`}
                        >
                            <input
                                type="radio"
                                name="foodType"
                                value={type.value}
                                checked={formData.foodType === type.value}
                                onChange={handleChange}
                                className="sr-only"
                            />

                            <span>{type.icon}</span>
                            <span>{type.label}</span>
                        </label>
                    ))}
                </div>

                {errors.foodType && (
                    <span className={errorClass}>
                        {errors.foodType}
                    </span>
                )}
            </div>

            {/* Quantity */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="quantity"
                    className="font-app-body text-md text-inactive font-medium"
                >
                    Quantity (kg / servings)
                </label>

                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="E.g. 12"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={inputClass}
                    required
                />

                {errors.quantity && (
                    <span className={errorClass}>
                        {errors.quantity}
                    </span>
                )}
            </div>

            {/* Storage History */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="storageHistory"
                    className="font-app-body text-md text-inactive font-medium"
                >
                    Previous Storage History
                </label>

                <select
                    id="storageHistory"
                    name="storageHistory"
                    value={formData.storageHistory}
                    onChange={handleChange}
                    className={inputClass}
                    required
                >
                    <option value="">Select storage history</option>

                    {STORAGE_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {errors.storageHistory && (
                    <span className={errorClass}>
                        {errors.storageHistory}
                    </span>
                )}
            </div>

            {/* Ingredients */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="ingredients"
                    className="font-app-body text-md text-inactive font-medium"
                >
                    Ingredients
                </label>

                <textarea
                    id="ingredients"
                    name="ingredients"
                    rows={3}
                    placeholder="E.g. Rice, dal, potato, spices, oil"
                    value={formData.ingredients}
                    onChange={handleChange}
                    className={inputClass}
                    required
                />

                <p className="text-xs text-inactive">
                    Separate ingredients with commas.
                </p>

                {errors.ingredients && (
                    <span className={errorClass}>
                        {errors.ingredients}
                    </span>
                )}
            </div>

            {/* Preparation Date and Time */}
            <div className="flex flex-col gap-1">
                <label
                    htmlFor="dateTime"
                    className="font-app-body text-md text-inactive font-medium"
                >
                    Prepared Date &amp; Time
                </label>

                <input
                    id="dateTime"
                    name="dateTime"
                    type="datetime-local"
                    value={formData.dateTime}
                    onChange={handleChange}
                    max={new Date(
                        Date.now() -
                            new Date().getTimezoneOffset() * 60000
                    )
                        .toISOString()
                        .slice(0, 16)}
                    className={inputClass}
                    required
                />

                {errors.dateTime && (
                    <span className={errorClass}>
                        {errors.dateTime}
                    </span>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50 bg-primary border border-white/20 text-secondary/70 rounded-[10px] text-xl font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {isSubmitting
                    ? "Registering..."
                    : "Schedule Pickup"}
            </button>
        </form>
    );
};
