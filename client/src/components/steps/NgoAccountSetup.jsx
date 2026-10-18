import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const NgoAccountSetup = ({ formData, handleChange, errors }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full min-w-0 py-1">
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
                {/* Organization Email and Contact Number */}
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            className="font-heading text-sm font-medium text-inactive sm:text-base"
                            htmlFor="email"
                        >
                            Organization Email
                        </label>

                        <input
                            className={`w-full min-w-0 rounded-lg border bg-background/20 px-3 py-3 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:text-base ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-cta/20"
                            }`}
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="foodforall@gmail.com"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={
                                errors.email ? "email-error" : undefined
                            }
                            required
                        />

                        {errors.email && (
                            <span
                                id="email-error"
                                className="break-words text-xs text-red-400 sm:text-sm"
                            >
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col gap-1">
                        <label
                            className="font-heading text-sm font-medium text-inactive sm:text-base"
                            htmlFor="phone-number"
                        >
                            Contact Number
                        </label>

                        <input
                            className={`w-full min-w-0 rounded-lg border bg-background/20 px-3 py-3 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:text-base ${
                                errors.phoneNumber
                                    ? "border-red-500"
                                    : "border-cta/20"
                            }`}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="tel"
                            id="phone-number"
                            name="phoneNumber"
                            placeholder="+91 00000 00000"
                            aria-invalid={Boolean(errors.phoneNumber)}
                            aria-describedby={
                                errors.phoneNumber
                                    ? "phone-number-error"
                                    : undefined
                            }
                            required
                        />

                        {errors.phoneNumber && (
                            <span
                                id="phone-number-error"
                                className="break-words text-xs text-red-400 sm:text-sm"
                            >
                                {errors.phoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Password */}
                <div className="flex min-w-0 flex-col gap-1">
                    <label
                        className="font-heading text-sm font-medium text-inactive sm:text-base"
                        htmlFor="password"
                    >
                        Password
                    </label>

                    <div className="relative min-w-0">
                        <input
                            className={`w-full min-w-0 rounded-lg border bg-background/20 px-3 py-3 pr-12 text-sm text-inactive shadow-xl shadow-black/10 backdrop-blur-xl placeholder:text-inactive/40 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-4 sm:pr-12 sm:text-base ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-cta/20"
                            }`}
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="********"
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={
                                errors.password ? "password-error" : undefined
                            }
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((prev) => !prev)
                            }
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-inactive transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-4"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>

                    {errors.password && (
                        <span
                            id="password-error"
                            className="break-words text-xs text-red-400 sm:text-sm"
                        >
                            {errors.password}
                        </span>
                    )}
                </div>

                {/* Declarations */}
                <div className="flex min-w-0 flex-col gap-4 rounded-xl border border-white/10 bg-background/10 p-3 sm:gap-5 sm:p-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <input
                            type="checkbox"
                            name="docDeclaration"
                            id="doc-declaration"
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-cta sm:h-5 sm:w-5"
                            checked={Boolean(formData.docDeclaration)}
                            onChange={handleChange}
                            required
                        />

                        <label
                            htmlFor="doc-declaration"
                            className="min-w-0 cursor-pointer text-xs leading-5 text-inactive sm:text-sm sm:leading-6"
                        >
                            I confirm that the information and documents
                            provided are accurate and I am authorized to
                            register this NGO.
                        </label>
                    </div>

                    <div className="flex min-w-0 items-start gap-3">
                        <input
                            type="checkbox"
                            name="termsDeclaration"
                            id="terms-declaration"
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-cta sm:h-5 sm:w-5"
                            checked={Boolean(formData.termsDeclaration)}
                            onChange={handleChange}
                            required
                        />

                        <label
                            htmlFor="terms-declaration"
                            className="min-w-0 cursor-pointer text-xs leading-5 text-inactive sm:text-sm sm:leading-6"
                        >
                            I agree to the platform&apos;s Terms of Service
                            and Food Donation Policy.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};