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
        "block w-full min-w-0 rounded-lg border border-primary/30 border-b-2 bg-tertiary px-3 py-3 text-sm text-inactive outline-none transition placeholder:text-inactive/50 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:px-4 sm:text-base";

    const errorClass = "break-words text-xs leading-5 text-red-400 sm:text-sm";

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

            const response = await fetch("/api/donor/create-donation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || data.success === false) {
                onMessage?.({
                    type: "error",
                    title: "Donation Failed",
                    message:
                        data.message ||
                        "Unable to register your donation. Please try again.",
                });
                return;
            }

            onMessage?.({
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

            onMessage?.({
                type: "error",
                title: "Donation Failed",
                message:
                    "Unable to connect to the server. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldProps = (name) => ({
        "aria-invalid": Boolean(errors[name]),
        "aria-describedby": errors[name] ? `${name}-error` : undefined,
    });

    return (
        <form
            className="flex w-full min-w-0 flex-col gap-4 sm:gap-5"
            onSubmit={handleSubmit}
            noValidate
        >
            {/* Food Name */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <label
                    htmlFor="foodName"
                    className="font-app-body text-sm font-medium text-inactive sm:text-base"
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
                    {...getFieldProps("foodName")}
                />

                {errors.foodName && (
                    <span id="foodName-error" className={errorClass}>
                        {errors.foodName}
                    </span>
                )}
            </div>

            {/* Food Type */}
            <fieldset className="flex min-w-0 flex-col gap-2">
                <legend className="mb-2 font-app-body text-sm font-medium text-inactive sm:text-base">
                    Food Type
                </legend>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {FOOD_TYPES.map((type) => (
                        <label
                            key={type.value}
                            className={`flex min-h-12 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 px-2 py-3 text-sm font-bold transition sm:text-base ${
                                formData.foodType === type.value
                                    ? "border-primary bg-primary/20 text-heading"
                                    : "border-secondary/20 bg-brown text-heading hover:border-primary/60"
                            }`}
                        >
                            <input
                                type="radio"
                                name="foodType"
                                value={type.value}
                                checked={formData.foodType === type.value}
                                onChange={handleChange}
                                className="sr-only"
                                aria-invalid={Boolean(errors.foodType)}
                                aria-describedby={
                                    errors.foodType ? "foodType-error" : undefined
                                }
                            />

                            <span aria-hidden="true">{type.icon}</span>
                            <span className="break-words">{type.label}</span>
                        </label>
                    ))}
                </div>

                {errors.foodType && (
                    <span id="foodType-error" className={errorClass}>
                        {errors.foodType}
                    </span>
                )}
            </fieldset>

            {/* Quantity */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <label
                    htmlFor="quantity"
                    className="font-app-body text-sm font-medium text-inactive sm:text-base"
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
                    {...getFieldProps("quantity")}
                />

                {errors.quantity && (
                    <span id="quantity-error" className={errorClass}>
                        {errors.quantity}
                    </span>
                )}
            </div>

            {/* Storage History */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <label
                    htmlFor="storageHistory"
                    className="font-app-body text-sm font-medium text-inactive sm:text-base"
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
                    {...getFieldProps("storageHistory")}
                >
                    <option value="">Select storage history</option>

                    {STORAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {errors.storageHistory && (
                    <span id="storageHistory-error" className={errorClass}>
                        {errors.storageHistory}
                    </span>
                )}
            </div>

            {/* Ingredients */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <label
                    htmlFor="ingredients"
                    className="font-app-body text-sm font-medium text-inactive sm:text-base"
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
                    className={`${inputClass} min-h-24 resize-y`}
                    required
                    {...getFieldProps("ingredients")}
                />

                <p className="text-xs leading-5 text-inactive">
                    Separate ingredients with commas.
                </p>

                {errors.ingredients && (
                    <span id="ingredients-error" className={errorClass}>
                        {errors.ingredients}
                    </span>
                )}
            </div>

            {/* Preparation Date and Time */}
            <div className="flex min-w-0 flex-col gap-1.5">
                <label
                    htmlFor="dateTime"
                    className="font-app-body text-sm font-medium text-inactive sm:text-base"
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
                        Date.now() - new Date().getTimezoneOffset() * 60000
                    )
                        .toISOString()
                        .slice(0, 16)}
                    className={inputClass}
                    required
                    {...getFieldProps("dateTime")}
                />

                {errors.dateTime && (
                    <span id="dateTime-error" className={errorClass}>
                        {errors.dateTime}
                    </span>
                )}
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-primary px-4 py-3 text-base font-bold text-secondary/80 shadow-lg shadow-primary/30 backdrop-blur-3xl transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brown disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
            >
                {isSubmitting ? "Registering..." : "Schedule Pickup"}
            </button>
        </form>
    );
};