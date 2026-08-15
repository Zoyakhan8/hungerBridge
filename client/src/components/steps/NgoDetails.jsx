export const NgoDetails = ({ formData, handleChange, errors }) => {
    return (
        <div className="py-1">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <div className="flex flex-col gap-1 ">
                        <label className="font-heading text-md text-inactive font-medium" htmlFor="organization-name" >Organization Name</label>
                        <input
                            className={`text-inactive px-4 py-3 bg-background/20
                            backdrop-blur-xl rounded-[8px] w-full border
                            shadow-xl shadow-black/10
                            ${errors.organizationName
                                    ? "border-red-500"
                                    : "border-cta/20"
                                }`}
                            value={formData.organizationName}
                            onChange={handleChange}
                            type="text" id="organization-name" name="organizationName" placeholder="e.g Food For All" required
                        />
                        {errors.organizationName && (
                            <span className="text-red-400 text-sm">
                                {errors.organizationName}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                        <label className="font-heading text-md text-inactive font-medium" htmlFor="registered-number" >Registered Number</label>
                        <input
                            className={` text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/20 shadow-xl shadow-black/10
                             ${errors.registeredNumber
                                    ? "border-red-500"
                                    : "border-cta/20"
                                }`}
                            value={formData.registeredNumber}
                            onChange={handleChange}
                            type="text" id="registered-number" name="registeredNumber" placeholder="000000000000" required
                        />
                        {errors.registeredNumber && (
                            <span className="text-red-400 text-sm">
                                {errors.registeredNumber}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <label className="font-heading text-md text-inactive font-medium" htmlFor="registered-address" >Registered Address</label>
                    <textarea
                        className={` text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-cta/20 shadow-xl shadow-black/10
                              ${errors.registeredAddress
                                ? "border-red-500"
                                : "border-cta/20"
                            }`}
                        rows={3}
                        value={formData.registeredAddress}
                        onChange={handleChange}
                        id="registered-address" name="registeredAddress" placeholder="Enter complete office address" required>
                    </textarea>
                    {errors.registeredAddress && (
                        <span className="text-red-400 text-sm">
                            {errors.registeredAddress}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}