import { useState } from "react";
import Cropper from "react-easy-crop";
import { Message } from "./Message";
export const ProfileSetup = () => {
    const [formData, setFormData] = useState({
        photo: null,
        dob: "",
        shopName: "",
        shopAddress: "",
        aadhar: null,
        shopLicense: null,

        refrigerator: false,
        refrigeratorNumber: "",
        refrigeratorTemperature: "",

        freezer: false,
        freezerNumber: "",
        freezerTemperature: "",
        
        kitchen: false,
    })
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "dob":
                if (!value.trim()) {
                    error = "Date of Birth is required";
                }
                break;

            case "shopName":
                if (!value.trim()) {
                    error = "Shop name is required";
                }
                break;

            case "shopAddress":
                if (!value.trim()) {
                    error = "Shop address is required";
                }
                else if (value.trim().length < 10) {
                    error = "Enter a complete address";
                }
                break;
            case "aadhar":
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
            case "shopLicense":
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
            case "photo":
                if (!value) {
                    error = "Document is required";
                } else {
                    const allowedTypes = [
                        "image/png",
                        "image/jpeg",
                        "image/jpg"
                    ];
                    if (!allowedTypes.includes(value.type)) {
                        error = "Only JPEG, JPG, and PNG files are allowed";
                    }
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
        const { name, value, type, files,checked } = event.target;
        if (type === "file") {
            const file = files?.[0] || null;
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "image/jpg"
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
            if (name === "photo") {
                setFormData((prev) => ({
                    ...prev,
                    photo: file,
                }));

                setPhotoPreview(URL.createObjectURL(file));

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
    }
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });
    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value);
        });
        for (const [key, value] of data.entries()) {
            console.log("form submitted", key, value);
        }
        try {
            const res = await fetch("/api/donor/create-profile", {
                method: "POST",
                body: data
            })
            const result = await res.json()
            if (res.ok) {
                setMessageData({
                    type: "success",
                    title: "Profile Completed",
                    message: "Your donation is now available for nearby NGOs to accept. We'll notify you once it's matched.",
                });
                setShowMessage(true);
                setFormData({
                    photo: null,
                    dob: "",
                    shopName: "",
                    shopAddress: "",
                    aadhar: null,
                    shopLicense: null
                })
            } else {
                setMessageData({
                    type: "error",
                    title: "Profile Failed",
                    message: result.message,
                });
                setShowMessage(true);
                console.log(setMessageData)
            }
        } catch (error) {
            setMessageData({
                type: "error",
                title: "Profile Failed",
                message: "Something went wrong.Please try again",
            });
            setShowMessage(true);
            console.log(setMessageData)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-brown p-6">
            <div className="bg-background backdrop-blur-xl rounded-[8px] p-8 border border-white/20 shadow-lg shadow-black/10 w-[600px]">
                <div className="flex flex-col gap-2 items-center pb-8">
                    <h1 className="font-app-heading text-heading text-4xl font-extrabold">Complete Your Profile</h1>
                    <p className="font-app-body text-heading text-sm font-bold">Help us connect you with meaningful impact opportunities.</p>
                </div>
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="flex flex-col justify-center items-center gap-1 flex-1">
                        <label htmlFor="photo"
                            className="font-app-body text-md text-inactive font-medium"
                        >Profile Photo</label>
                        <label
                            htmlFor="photo"
                            className="relative h-30 w-30 cursor-pointer flex-col items-center justify-center
                                    rounded-full border border-2 border-primary/40
                                    bg-tertiary transition hover:border-primary overflow-hidden "
                        >
                            {formData.photo ? (
                                <Cropper
                                    image={photoPreview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    cropSize={{ width: 250, height: 250 }}
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={(_, croppedPixels) => {
                                        setCroppedAreaPixels(croppedPixels);
                                    }}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <span className="font-heading text-sm font-bold text-heading/70">
                                        Photo
                                    </span>
                                </div>
                            )}
                        </label>
                        <input
                            onChange={handleChange}
                            id="photo"
                            name="photo"
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            className="hidden"
                        />
                    </div>
                    <div className="flex flex-row gap-6">
                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="dob"
                                className="font-app-body text-md text-inactive font-medium"
                            >Date of Birth</label>

                            <input
                                type="date" id="dob" name="dob" placeholder="E.g Chicken Biryani"
                                required value={formData.dob}
                                onChange={handleChange}
                                className="text-inactive px-4 py-3 bg-tertiary
                                rounded-[4px] w-full border-b-3 border-primary/50 outline-none"
                            />
                            {errors.dob && (
                                <span className="text-red-400 text-sm">
                                    {errors.dob}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <label htmlFor="shopName"
                                className="font-app-body text-md text-inactive font-medium"
                            >Shop Name</label>

                            <input
                                type="text" id="shopName" name="shopName" placeholder="E.g Chicken Biryani"
                                required value={formData.shopName}
                                onChange={handleChange}
                                className="text-inactive px-4 py-3 bg-tertiary
                                rounded-[4px] w-full border-b-3 border-primary/50 outline-none"
                            />
                            {errors.shopName && (
                                <span className="text-red-400 text-sm">
                                    {errors.shopName}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label htmlFor="shopAddress"
                            className="font-app-body text-md text-inactive font-medium"
                        >Shop Address</label>
                        <textarea
                            rows="2" id="shopAddress" name="shopAddress" placeholder="E.g Chicken, Onion, Rice"
                            required value={formData.shopAddress}
                            onChange={handleChange}
                            className="text-inactive px-4 py-3 bg-tertiary
                            rounded-[4px] w-full border-b-3 border-primary/50 outline-none"
                        ></textarea>
                        {errors.shopAddress && (
                            <span className="text-red-400 text-sm">
                                {errors.shopAddress}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="font-app-heading text-heading text-xl font-extrabold pb-2">Facilities Details</h1>
                        <div className="flex flex-col gap-5">
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer text-heading font-app-body">
                                    <input
                                        type="checkbox"
                                        name="refrigerator"
                                        checked={formData.refrigerator}
                                        onChange={handleChange}
                                        className="h-5 w-5 accent-secondary/80 check-white cursor-pointer"
                                    />

                                    <span>Refrigerator</span>
                                </label>

                                {formData.refrigerator && (
                                    <div className="mt-3 ml-8 rounded-lg bg-tertiary p-5">
                                        <div className="grid grid-cols-2 gap-6">

                                            {/* Number */}
                                            <div>
                                                <label
                                                    htmlFor="refrigeratorNumber"
                                                    className="font-app-body text-sm font-medium text-inactive"
                                                >
                                                    Number:
                                                </label>

                                                <input
                                                    type="number"
                                                    id="refrigeratorNumber"
                                                    name="refrigeratorNumber"
                                                    min="1"
                                                    value={formData.refrigeratorNumber}
                                                    onChange={handleChange}
                                                    className="mt-1 w-full border-b-2 border-primary/30
                                bg-background/40 px-3 py-2 outline-none
                                text-heading"
                                                />
                                            </div>

                                            {/* Temperature */}
                                            <div>
                                                <label
                                                    htmlFor="refrigeratorTemperature"
                                                    className="font-app-body font-medium text-sm text-inactive"
                                                >
                                                    Temperature:
                                                </label>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        id="refrigeratorTemperature"
                                                        name="refrigeratorTemperature"
                                                        value={formData.refrigeratorTemperature}
                                                        disabled={formData.refrigeratorTempUnknown}
                                                        onChange={handleChange}
                                                        className="mt-1 w-full border-b-2 border-primary/30
                                    bg-background/40 px-3 py-2 outline-none
                                    text-heading disabled:opacity-40"
                                                    />

                                                    <span className="whitespace-nowrap text-sm text-inactive">
                                                        °C
                                                    </span>
                                                </div>

                                                <label className="mt-2 flex items-center gap-2 text-xs text-inactive">
                                                    <input
                                                        type="checkbox"
                                                        name="refrigeratorTempUnknown"
                                                        checked={formData.refrigeratorTempUnknown}
                                                        onChange={handleChange}
                                                        className="accent-secondary/80"
                                                    />
                                                    Not known
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Freezer */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer text-heading font-app-body">
                                    <input
                                        type="checkbox"
                                        name="freezer"
                                        checked={formData.freezer}
                                        onChange={handleChange}
                                        className="h-5 w-5 accent-secondary/80 cursor-pointer"
                                    />

                                    <span>Freezer</span>
                                </label>

                                {formData.freezer && (
                                    <div className="mt-3 ml-8 rounded-lg bg-tertiary p-5">
                                        <div className="grid grid-cols-2 gap-6">

                                            <div>
                                                <label
                                                    htmlFor="freezerNumber"
                                                    className="font-app-body font-medium text-sm text-inactive"
                                                >
                                                    Number:
                                                </label>

                                                <input
                                                    type="number"
                                                    id="freezerNumber"
                                                    name="freezerNumber"
                                                    min="1"
                                                    value={formData.freezerNumber}
                                                    onChange={handleChange}
                                                    className="mt-1 w-full border-b-2 border-primary/30
                                bg-background/40 px-3 py-2 outline-none
                                text-heading"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="freezerTemperature"
                                                    className="font-app-body font-medium text-sm text-inactive"
                                                >
                                                    Temperature:
                                                </label>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        id="freezerTemperature"
                                                        name="freezerTemperature"
                                                        value={formData.freezerTemperature}
                                                        disabled={formData.freezerTempUnknown}
                                                        onChange={handleChange}
                                                        className="mt-1 w-full border-b-2 border-primary/30
                                    bg-background/40 px-3 py-2 outline-none
                                    text-heading disabled:opacity-40"
                                                    />

                                                    <span className="whitespace-nowrap text-sm text-inactive">
                                                        °C
                                                    </span>
                                                </div>

                                                <label className="mt-2 flex items-center gap-2 text-xs text-inactive">
                                                    <input
                                                        type="checkbox"
                                                        name="freezerTempUnknown"
                                                        checked={formData.freezerTempUnknown}
                                                        onChange={handleChange}
                                                        className="accent-secondary/80"
                                                    />
                                                    Not known
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>


                            {/* Kitchen */}
                            <label className="flex items-center gap-3 cursor-pointer text-heading font-app-body">
                                <input
                                    type="checkbox"
                                    name="kitchen"
                                    checked={formData.kitchen}
                                    onChange={handleChange}
                                    className="h-5 w-5 accent-secondary/80 cursor-pointer"
                                />

                                <span>Kitchen / food preparation area</span>
                            </label>

                        </div>
                    </div>
                    <div>
                        <h1 className="font-app-heading text-heading text-xl font-extrabold pb-2">Document Verification</h1>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="aadhar"
                                    className="font-app-body text-md text-inactive font-medium"
                                >Aadhar Card</label>
                                <label
                                    htmlFor="aadhar"
                                    className="flex h-20 cursor-pointer flex-col items-center justify-center
                                    rounded-lg border border-dashed border-primary/40
                                    bg-tertiary transition hover:border-primary"
                                >
                                    <span className="block text-center w-full p-3 mt-1 font-heading text-sm font-bold text-heading/70 break-words">
                                        {formData.aadhar
                                            ? formData.aadhar.name : "PDF, JPG, PNG (Max 5MB)"}
                                    </span>
                                    {errors.aadhar && (
                                        <span className="text-red-400 text-sm">
                                            {errors.aadhar}
                                        </span>
                                    )}
                                </label>
                                <input
                                    id="aadhar"
                                    name="aadhar"
                                    type="file"
                                    onChange={handleChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <label htmlFor="shopLicense"
                                    className="font-app-body text-md text-inactive font-medium"
                                >Shop License</label>
                                <label
                                    htmlFor="shopLicense"
                                    className="flex h-20 cursor-pointer flex-col items-center justify-center
                                    rounded-lg border border-dashed border-primary/40
                                    bg-tertiary transition hover:border-primary "
                                >
                                    <span className=" block text-center w-full p-3 mt-1 font-heading text-sm font-bold text-heading/70 break-words">
                                        {formData.shopLicense
                                            ? formData.shopLicense.name : "PDF, JPG, PNG (Max 5MB)"}
                                    </span>
                                    {errors.shopLicense && (
                                        <span className="text-red-400 text-sm">
                                            {errors.shopLicense}
                                        </span>
                                    )}
                                </label>
                                <input
                                    id="shopLicense"
                                    name="shopLicense"
                                    type="file"
                                    onChange={handleChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <button type="submit"
                            className="inline-block backdrop-blur-3xl px-10 py-3 shadow-[0_4px_20px] shadow-primary/50
                            bg-primary border border-white/20 text-secondary/70 rounded-[10px] text-xl font-bold
                            cursor-pointer"
                        >Complete Profile</button>
                    </div>
                </form>
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