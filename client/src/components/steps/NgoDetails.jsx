export const NgoDetails = ({ formData, handleChange, errors }) => {
    return (
        <div className="w-full min-w-0 py-1">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
                {/* Organization Name and Registered Number */}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            className="font-heading text-sm font-medium text-inactive sm:text-base"
                            htmlFor="organization-name"
                        >
                            Organization Name
                        </label>

                        <input
                            className={`w-full min-w-0 rounded-lg border bg-background/20 px-3 py-3 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-colors placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:text-base ${
                                errors.organizationName
                                    ? "border-red-500"
                                    : "border-cta/20"
                            }`}
                            value={formData.organizationName}
                            onChange={handleChange}
                            type="text"
                            id="organization-name"
                            name="organizationName"
                            placeholder="e.g Food For All"
                            aria-invalid={Boolean(errors.organizationName)}
                            aria-describedby={
                                errors.organizationName
                                    ? "organization-name-error"
                                    : undefined
                            }
                            required
                        />

                        {errors.organizationName && (
                            <span
                                id="organization-name-error"
                                className="break-words text-xs text-red-400 sm:text-sm"
                            >
                                {errors.organizationName}
                            </span>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            className="font-heading text-sm font-medium text-inactive sm:text-base"
                            htmlFor="registered-number"
                        >
                            Registered Number
                        </label>

                        <input
                            className={`w-full min-w-0 rounded-lg border bg-background/20 px-3 py-3 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-colors placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:text-base ${
                                errors.registeredNumber
                                    ? "border-red-500"
                                    : "border-cta/20"
                            }`}
                            value={formData.registeredNumber}
                            onChange={handleChange}
                            type="text"
                            id="registered-number"
                            name="registeredNumber"
                            placeholder="000000000000"
                            aria-invalid={Boolean(errors.registeredNumber)}
                            aria-describedby={
                                errors.registeredNumber
                                    ? "registered-number-error"
                                    : undefined
                            }
                            required
                        />

                        {errors.registeredNumber && (
                            <span
                                id="registered-number-error"
                                className="break-words text-xs text-red-400 sm:text-sm"
                            >
                                {errors.registeredNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Registered Address */}
                <div className="flex min-w-0 flex-col gap-1">
                    <label
                        className="font-heading text-sm font-medium text-inactive sm:text-base"
                        htmlFor="registered-address"
                    >
                        Registered Address
                    </label>

                    <textarea
                        className={`w-full min-w-0 resize-y rounded-lg border bg-background/20 px-3 py-3 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-colors placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:text-base ${
                            errors.registeredAddress
                                ? "border-red-500"
                                : "border-cta/20"
                        }`}
                        rows={3}
                        value={formData.registeredAddress}
                        onChange={handleChange}
                        id="registered-address"
                        name="registeredAddress"
                        placeholder="Enter complete office address"
                        aria-invalid={Boolean(errors.registeredAddress)}
                        aria-describedby={
                            errors.registeredAddress
                                ? "registered-address-error"
                                : undefined
                        }
                        required
                    />

                    {errors.registeredAddress && (
                        <span
                            id="registered-address-error"
                            className="break-words text-xs text-red-400 sm:text-sm"
                        >
                            {errors.registeredAddress}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};