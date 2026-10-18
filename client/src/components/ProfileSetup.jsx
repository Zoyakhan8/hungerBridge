import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Message } from "./Message";

const INITIAL_FORM_DATA = {
    photo: null,
    dob: "",
    shopName: "",
    shopAddress: "",
    aadhar: null,
    shopLicense: null,
    refrigerator: false,
    refrigeratorNumber: "",
    refrigeratorTemperature: "",
    refrigeratorTempUnknown: false,
    freezer: false,
    freezerNumber: "",
    freezerTemperature: "",
    freezerTempUnknown: false,
    kitchen: false,
};

const ALLOWED_DOCUMENT_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
];

const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const inputClass =
    "block w-full min-w-0 rounded-lg border border-primary/30 border-b-2 bg-tertiary px-3 py-3 text-sm text-inactive outline-none transition placeholder:text-inactive/50 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:px-4 sm:text-base";

const labelClass =
    "mb-1.5 block text-sm font-medium text-inactive sm:text-base";

const errorClass = "mt-1 text-xs leading-5 text-red-400 sm:text-sm";

const sectionTitleClass =
    "mb-3 font-app-heading text-lg font-extrabold text-heading sm:text-xl";

const getCroppedImage = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Unable to process the profile photo.");
    }

    context.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Unable to crop the profile photo."));
                    return;
                }

                resolve(
                    new File([blob], "profile-photo.jpg", {
                        type: "image/jpeg",
                    })
                );
            },
            "image/jpeg",
            0.92
        );
    });
};

export const ProfileSetup = () => {
    const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });

    useEffect(() => {
        return () => {
            if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);

    const showFeedback = (type, title, message) => {
        setMessageData({ type, title, message });
        setShowMessage(true);
    };

    const validateField = (name, value) => {
        let error = "";

        switch (name) {
            case "dob": {
                if (!value) {
                    error = "Date of birth is required.";
                } else {
                    const birthDate = new Date(`${value}T00:00:00`);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);

                    if (Number.isNaN(birthDate.getTime())) {
                        error = "Enter a valid date of birth.";
                    } else if (birthDate > today) {
                        error = "Date of birth cannot be in the future.";
                    }
                }
                break;
            }

            case "shopName":
                if (!value?.trim()) {
                    error = "Shop name is required.";
                }
                break;

            case "shopAddress":
                if (!value?.trim()) {
                    error = "Shop address is required.";
                } else if (value.trim().length < 10) {
                    error = "Enter a complete address (at least 10 characters).";
                }
                break;

            case "photo":
                if (!value) {
                    error = "Profile photo is required.";
                } else if (!ALLOWED_PHOTO_TYPES.includes(value.type)) {
                    error = "Only JPEG and PNG photos are allowed.";
                } else if (value.size > MAX_FILE_SIZE) {
                    error = "Profile photo must be 5 MB or smaller.";
                }
                break;

            case "aadhar":
            case "shopLicense":
                if (!value) {
                    error = "Document is required.";
                } else if (!ALLOWED_DOCUMENT_TYPES.includes(value.type)) {
                    error = "Only PDF, JPG, and PNG files are allowed.";
                } else if (value.size > MAX_FILE_SIZE) {
                    error = "File must be 5 MB or smaller.";
                }
                break;

            case "refrigeratorNumber":
            case "freezerNumber":
                if (value !== "" && (!Number.isFinite(Number(value)) || Number(value) < 1)) {
                    error = "Enter a number greater than or equal to 1.";
                }
                break;

            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleChange = (event) => {
        const { name, value, type, files, checked } = event.target;

        if (type === "file") {
            const file = files?.[0] || null;

            setTouched((prev) => ({ ...prev, [name]: true }));

            if (!file) {
                setFormData((prev) => ({ ...prev, [name]: null }));
                validateField(name, null);

                if (name === "photo") {
                    setPhotoPreview(null);
                    setCroppedAreaPixels(null);
                }
                return;
            }

            const valid = validateField(name, file);

            if (!valid) {
                setFormData((prev) => ({ ...prev, [name]: null }));
                return;
            }

            setFormData((prev) => ({ ...prev, [name]: file }));

            if (name === "photo") {
                setPhotoPreview(URL.createObjectURL(file));
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                setCroppedAreaPixels(null);
            }

            return;
        }

        const newValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setTouched((prev) => ({ ...prev, [name]: true }));

        if (name === "refrigeratorTempUnknown" && checked) {
            setFormData((prev) => ({
                ...prev,
                refrigeratorTempUnknown: true,
                refrigeratorTemperature: "",
            }));
        } else if (name === "freezerTempUnknown" && checked) {
            setFormData((prev) => ({
                ...prev,
                freezerTempUnknown: true,
                freezerTemperature: "",
            }));
        } else {
            validateField(name, newValue);
        }
    };

    const validateForm = () => {
        const fieldsToValidate = [
            "photo",
            "dob",
            "shopName",
            "shopAddress",
            "aadhar",
            "shopLicense",
        ];

        let valid = true;
        const nextErrors = {};

        fieldsToValidate.forEach((name) => {
            let error = "";

            switch (name) {
                case "photo":
                    if (!formData.photo) {
                        error = "Profile photo is required.";
                    } else if (!ALLOWED_PHOTO_TYPES.includes(formData.photo.type)) {
                        error = "Only JPEG and PNG photos are allowed.";
                    } else if (formData.photo.size > MAX_FILE_SIZE) {
                        error = "Profile photo must be 5 MB or smaller.";
                    }
                    break;

                case "dob": {
                    if (!formData.dob) {
                        error = "Date of birth is required.";
                    } else {
                        const birthDate = new Date(`${formData.dob}T00:00:00`);
                        const today = new Date();
                        today.setHours(23, 59, 59, 999);

                        if (
                            Number.isNaN(birthDate.getTime()) ||
                            birthDate > today
                        ) {
                            error = "Enter a valid date of birth.";
                        }
                    }
                    break;
                }

                case "shopName":
                    if (!formData.shopName.trim()) {
                        error = "Shop name is required.";
                    }
                    break;

                case "shopAddress":
                    if (!formData.shopAddress.trim()) {
                        error = "Shop address is required.";
                    } else if (formData.shopAddress.trim().length < 10) {
                        error = "Enter a complete address (at least 10 characters).";
                    }
                    break;

                case "aadhar":
                case "shopLicense": {
                    const file = formData[name];

                    if (!file) {
                        error = "Document is required.";
                    } else if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
                        error = "Only PDF, JPG, and PNG files are allowed.";
                    } else if (file.size > MAX_FILE_SIZE) {
                        error = "File must be 5 MB or smaller.";
                    }
                    break;
                }

                default:
                    break;
            }

            nextErrors[name] = error;
            if (error) valid = false;
        });

        ["refrigeratorNumber", "freezerNumber"].forEach((name) => {
            const enabled =
                name === "refrigeratorNumber"
                    ? formData.refrigerator
                    : formData.freezer;

            const value = formData[name];

            if (
                enabled &&
                value !== "" &&
                (!Number.isFinite(Number(value)) || Number(value) < 1)
            ) {
                nextErrors[name] = "Enter a number greater than or equal to 1.";
                valid = false;
            }
        });

        setErrors((prev) => ({ ...prev, ...nextErrors }));
        setTouched((prev) => ({
            ...prev,
            photo: true,
            dob: true,
            shopName: true,
            shopAddress: true,
            aadhar: true,
            shopLicense: true,
        }));

        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting || !validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            let photoToUpload = formData.photo;

            if (photoPreview && croppedAreaPixels) {
                photoToUpload = await getCroppedImage(
                    photoPreview,
                    croppedAreaPixels
                );
            }

            const data = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "photo") {
                    if (photoToUpload) {
                        data.append("photo", photoToUpload);
                    }
                    return;
                }

                if (value === null || value === undefined) return;

                if (typeof value === "boolean") {
                    data.append(key, String(value));
                } else {
                    data.append(key, value);
                }
            });

            const res = await fetch("/api/donor/create-profile", {
                method: "POST",
                credentials: "include",
                body: data,
            });

            const result = await res.json().catch(() => ({}));

            if (!res.ok || result.success === false) {
                showFeedback(
                    "error",
                    "Profile Failed",
                    result.message || "Unable to complete your profile. Please try again."
                );
                return;
            }

            setFormData({ ...INITIAL_FORM_DATA });
            setErrors({});
            setTouched({});
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedAreaPixels(null);
            setPhotoPreview(null);

            showFeedback(
                "success",
                "Profile Completed",
                result.message ||
                    "Your profile has been completed successfully."
            );
        } catch (error) {
            console.error("Profile setup error:", error);

            showFeedback(
                "error",
                "Profile Failed",
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderError = (name) =>
        touched[name] && errors[name] ? (
            <p className={errorClass} role="alert">
                {errors[name]}
            </p>
        ) : null;

    const renderFacilityDetails = (type) => {
        const isRefrigerator = type === "refrigerator";
        const title = isRefrigerator ? "Refrigerator" : "Freezer";
        const numberName = `${type}Number`;
        const temperatureName = `${type}Temperature`;
        const unknownName = `${type}TempUnknown`;

        return (
            <div className="min-w-0">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-heading sm:text-base">
                    <input
                        type="checkbox"
                        name={type}
                        checked={formData[type]}
                        onChange={handleChange}
                        className="h-5 w-5 shrink-0 cursor-pointer accent-secondary"
                    />
                    <span>{title}</span>
                </label>

                {formData[type] && (
                    <div className="mt-3 rounded-xl border border-primary/20 bg-tertiary p-3 sm:p-4">
                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            <div className="min-w-0">
                                <label
                                    htmlFor={numberName}
                                    className={labelClass}
                                >
                                    Number of units
                                </label>
                                <input
                                    type="number"
                                    id={numberName}
                                    name={numberName}
                                    min="1"
                                    step="1"
                                    value={formData[numberName]}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="E.g. 2"
                                />
                                {renderError(numberName)}
                            </div>

                            <div className="min-w-0">
                                <label
                                    htmlFor={temperatureName}
                                    className={labelClass}
                                >
                                    Temperature
                                </label>

                                <div className="flex min-w-0 items-center gap-2">
                                    <input
                                        type="number"
                                        id={temperatureName}
                                        name={temperatureName}
                                        step="any"
                                        value={formData[temperatureName]}
                                        disabled={formData[unknownName]}
                                        onChange={handleChange}
                                        className={`${inputClass} flex-1 disabled:cursor-not-allowed disabled:opacity-50`}
                                        placeholder="Temperature"
                                    />
                                    <span className="shrink-0 text-sm text-inactive">
                                        °C
                                    </span>
                                </div>

                                <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-inactive sm:text-sm">
                                    <input
                                        type="checkbox"
                                        name={unknownName}
                                        checked={formData[unknownName]}
                                        onChange={handleChange}
                                        className="h-4 w-4 accent-secondary"
                                    />
                                    Temperature unknown
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="min-h-screen w-full bg-brown px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/20 bg-background p-4 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-6 md:p-8">
                {/* Header */}
                <header className="mx-auto mb-7 flex max-w-2xl flex-col items-center gap-2 text-center sm:mb-8">
                    <h1 className="break-words font-app-heading text-2xl font-extrabold text-heading sm:text-3xl md:text-4xl">
                        Complete Your Profile
                    </h1>
                    <p className="text-sm font-medium leading-6 text-inactive sm:text-base">
                        Help us connect you with meaningful impact opportunities.
                    </p>
                </header>

                <form
                    className="flex min-w-0 flex-col gap-6 sm:gap-7"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Profile Photo */}
                    <section className="flex min-w-0 flex-col items-center">
                        <label htmlFor="photo" className={labelClass}>
                            Profile Photo
                        </label>

                        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/40 bg-tertiary transition hover:border-primary sm:h-32 sm:w-32">
                            {photoPreview ? (
                                <Cropper
                                    image={photoPreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_, croppedPixels) => {
                                        setCroppedAreaPixels(croppedPixels);
                                    }}
                                />
                            ) : (
                                <label
                                    htmlFor="photo"
                                    className="flex h-full w-full cursor-pointer items-center justify-center text-sm font-bold text-heading/70"
                                >
                                    Choose Photo
                                </label>
                            )}
                        </div>

                        {photoPreview && (
                            <div className="mt-4 w-full max-w-xs">
                                <label
                                    htmlFor="photoZoom"
                                    className="mb-2 block text-center text-sm text-inactive"
                                >
                                    Adjust photo zoom
                                </label>
                                <input
                                    id="photoZoom"
                                    type="range"
                                    min="1"
                                    max="3"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(event) =>
                                        setZoom(Number(event.target.value))
                                    }
                                    className="w-full accent-secondary"
                                />
                            </div>
                        )}

                        <input
                            onChange={handleChange}
                            id="photo"
                            name="photo"
                            type="file"
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            className="sr-only"
                        />

                        <label
                            htmlFor="photo"
                            className="mt-3 cursor-pointer rounded-lg border border-primary/30 px-4 py-2 text-sm font-semibold text-heading transition hover:bg-primary/10"
                        >
                            {photoPreview ? "Change Photo" : "Upload Photo"}
                        </label>

                        <p className="mt-2 text-center text-xs text-inactive">
                            JPEG or PNG, maximum 5 MB.
                        </p>
                        {renderError("photo")}
                    </section>

                    {/* Basic Details */}
                    <section>
                        <h2 className={sectionTitleClass}>Basic Details</h2>

                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            <div className="min-w-0">
                                <label htmlFor="dob" className={labelClass}>
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    id="dob"
                                    name="dob"
                                    required
                                    max={new Date().toISOString().slice(0, 10)}
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                                {renderError("dob")}
                            </div>

                            <div className="min-w-0">
                                <label htmlFor="shopName" className={labelClass}>
                                    Shop / Business Name
                                </label>
                                <input
                                    type="text"
                                    id="shopName"
                                    name="shopName"
                                    placeholder="E.g. Fresh Bakes"
                                    required
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                                {renderError("shopName")}
                            </div>
                        </div>

                        <div className="mt-4 min-w-0">
                            <label htmlFor="shopAddress" className={labelClass}>
                                Shop Address
                            </label>
                            <textarea
                                rows={3}
                                id="shopAddress"
                                name="shopAddress"
                                placeholder="Enter your complete shop address"
                                required
                                value={formData.shopAddress}
                                onChange={handleChange}
                                className={`${inputClass} resize-y`}
                            />
                            {renderError("shopAddress")}
                        </div>
                    </section>

                    {/* Facilities */}
                    <section className="min-w-0">
                        <h2 className={sectionTitleClass}>Facilities Details</h2>

                        <div className="flex min-w-0 flex-col gap-5">
                            {renderFacilityDetails("refrigerator")}
                            {renderFacilityDetails("freezer")}

                            <label className="flex cursor-pointer items-start gap-3 text-sm text-heading sm:text-base">
                                <input
                                    type="checkbox"
                                    name="kitchen"
                                    checked={formData.kitchen}
                                    onChange={handleChange}
                                    className="mt-0.5 h-5 w-5 shrink-0 accent-secondary"
                                />
                                <span>Kitchen / food preparation area</span>
                            </label>
                        </div>
                    </section>

                    {/* Document Verification */}
                    <section className="min-w-0">
                        <h2 className={sectionTitleClass}>
                            Document Verification
                        </h2>

                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {[
                                {
                                    name: "aadhar",
                                    label: "Aadhaar Card",
                                },
                                {
                                    name: "shopLicense",
                                    label: "Shop License",
                                },
                            ].map(({ name, label }) => (
                                <div key={name} className="min-w-0">
                                    <label
                                        htmlFor={name}
                                        className={labelClass}
                                    >
                                        {label}
                                    </label>

                                    <label
                                        htmlFor={name}
                                        className="flex min-h-24 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-primary/40 bg-tertiary p-4 text-center transition hover:border-primary hover:bg-primary/5"
                                    >
                                        <span className="break-words text-sm font-medium text-heading/80">
                                            {formData[name]?.name ||
                                                "Choose PDF, JPG or PNG (max 5 MB)"}
                                        </span>
                                    </label>

                                    <input
                                        id={name}
                                        name={name}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                        onChange={handleChange}
                                        className="sr-only"
                                    />

                                    {renderError(name)}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-primary px-5 py-3 text-base font-bold text-background shadow-lg shadow-primary/30 transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brown disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
                    >
                        {isSubmitting
                            ? "Completing Profile..."
                            : "Complete Profile"}
                    </button>
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