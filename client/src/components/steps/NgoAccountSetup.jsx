import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
export const NgoAccountSetup = ({ formData, handleChange, errors }) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="py-1">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-1 ">
                        <label className="font-heading text-md text-inactive font-medium" htmlFor="email" >Organization Email</label>
                        <input className={`text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/20 shadow-xl shadow-black/10
                              ${errors.email
                                ? "border-red-500"
                                : "border-cta/20"
                            }`}
                            value={formData.email}
                            onChange={handleChange}
                            type="email" id="email" name="email" placeholder="foodforall@gmail.com" required
                        />
                        {errors.email && (
                            <span className="text-red-400 text-sm">
                                {errors.email}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="font-heading text-md text-inactive font-medium" htmlFor="phone-number" >Contact Number</label>
                        <input className={` text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/20 shadow-xl shadow-black/10
                              ${errors.phoneNumber
                                ? "border-red-500"
                                : "border-cta/20"
                            }`}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            type="tel" id="phone-number" name="phoneNumber" placeholder="+91 00000 00000" required
                        />
                        {errors.phoneNumber && (
                            <span className="text-red-400 text-sm">
                                {errors.phoneNumber}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="font-heading text-md text-inactive font-medium" htmlFor="password" >Password</label>
                    <div className="relative">
                        <input className={` text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/20 shadow-xl shadow-black/10
                             ${errors.password
                                ? "border-red-500"
                                : "border-cta/20"
                            }`}
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            id="password" name="password" placeholder="********" required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2
                            text-inactive hover:text-primary cursor-pointer"
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <span className="text-red-400 text-sm">
                            {errors.password}
                        </span>
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <div className="flex gap-2">
                        <input type="checkbox" name="docDeclaration" id="doc-declaration"
                            className="w-5 h-5 accent-cta/90 cursor-pointer"
                            value={formData.docDeclaration = true}
                            onChange={handleChange}
                        />
                        <label htmlFor="doc-declaration" className="text-sm text-inactive">
                            I confirm that the information and documents provided are accurate and I am authorized to register this NGO.
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" name="termsDeclaration" id="terms-declaration"
                            className="w-4 h-4 accent-cta/90 cursor-pointer"
                            value={formData.termsDeclaration = true}
                            onChange={handleChange} />
                        <label htmlFor="terms-declaration" className="text-sm text-inactive">
                            I agree to the platform's Terms of Service and Food Donation Policy.
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}