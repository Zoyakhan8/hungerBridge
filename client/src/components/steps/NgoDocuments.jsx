export const NgoDocuments = ({ formData, handleChange, errors }) => {
    const documents = [
        {
            name: "registrationDocument",
            id: "ngo-registration-document",
            title: "NGO Registration Certificate",
            description: "Required • PDF, JPG, PNG",
            image: "/src/assets/registeredDoc.png",
            imageAlt: "Registration certificate",
        },
        {
            name: "panCard",
            id: "ngo-pancard-document",
            title: "PAN Card",
            description: "Required • PDF, JPG, PNG",
            image: "/src/assets/id-card.png",
            imageAlt: "PAN card",
        },
        {
            name: "addressProof",
            id: "ngo-address-document",
            title: "Address Proof",
            description: "Required • PDF, JPG, PNG",
            image: "/src/assets/location.png",
            imageAlt: "Address proof",
        },
    ];

    return (
        <div className="w-full min-w-0 py-1">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
                {documents.map((document) => (
                    <div
                        key={document.name}
                        className="flex w-full min-w-0 flex-col gap-4 rounded-xl border border-primary/20 bg-background/20 p-3 text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:bg-tertiary/70 sm:p-4 md:flex-row md:items-center md:justify-between"
                    >
                        {/* Document information */}
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-background/90 p-2 sm:h-12 sm:w-12">
                                <img
                                    src={document.image}
                                    alt={document.imageAlt}
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div className="flex min-w-0 flex-col gap-1">
                                <h2 className="break-words text-sm font-bold sm:text-base">
                                    {document.title}
                                </h2>

                                <p className="text-xs text-inactive/70 sm:text-sm">
                                    {document.description}
                                </p>
                            </div>
                        </div>

                        {/* Selected file and browse button */}
                        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center md:max-w-[55%]">
                            <div className="min-w-0 flex-1 text-sm">
                                <p
                                    className="break-all text-secondary/80"
                                    title={
                                        formData[document.name]?.name ||
                                        "No file selected"
                                    }
                                >
                                    {formData[document.name]?.name ||
                                        "No file selected"}
                                </p>

                                {errors[document.name] && (
                                    <p
                                        className="mt-1 break-words text-xs text-red-500 sm:text-sm"
                                        role="alert"
                                    >
                                        {errors[document.name]}
                                    </p>
                                )}
                            </div>

                            <div className="shrink-0">
                                <input
                                    type="file"
                                    id={document.id}
                                    className="peer sr-only"
                                    name={document.name}
                                    onChange={handleChange}
                                    accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                    required
                                />

                                <label
                                    htmlFor={document.id}
                                    className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg border border-primary/20 bg-background/20 px-4 py-2.5 text-sm font-medium text-inactive transition-colors hover:bg-primary/30 focus-within:ring-2 focus-within:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary sm:w-auto sm:whitespace-nowrap"
                                >
                                    Browse File
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};