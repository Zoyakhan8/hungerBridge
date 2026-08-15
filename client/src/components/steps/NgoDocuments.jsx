

export const NgoDocuments = ({ formData, handleChange, errors }) => {
    return (
        <div className="py-1">
            <div className="flex flex-col gap-6">
                <div className="max-w-[650px] flex gap-1 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-primary/20 shadow-xl shadow-black/10
                             justify-between items-center hover:bg-tertiary transition-all duration-300">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-md bg-background/90">
                            <img src="/src/assets/registeredDoc.png" alt="" width={24} />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-md font-bold">NGO Registration Certificate</h1>
                            <h1 className="text-inactive/70 text-sm">Required • PDF, JPG, PNG</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-secondary/70">
                                {formData.registrationDocument
                                    ? formData.registrationDocument.name
                                    : "No file selected"}
                            </span>
                            {errors.registrationDocument && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.registrationDocument}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                id="ngo-registration-document"
                                className="hidden"
                                name="registrationDocument"
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="ngo-registration-document"
                                className="inline-flex cursor-pointer gap-4 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-fit border 
                             border border-primary/20 shadow-xl shadow-black/10  hover:bg-primary/30"
                            >
                                Browse File
                            </label>
                        </div>
                    </div>
                </div>
                <div className="max-w-[650px] flex gap-1 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-primary/20 shadow-xl shadow-black/10
                             justify-between items-center hover:bg-tertiary transition-all duration-300">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-md bg-background/90">
                            <img src="/src/assets/id-card.png" alt="" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-md font-bold">PAN Card</h1>
                            <h1 className="text-inactive/70 text-sm">Required • PDF, JPG, PNG</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-secondary/70">
                                {formData.panCard
                                    ? formData.panCard.name
                                    : "No file selected"}
                            </span>
                            {errors.panCard && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.panCard}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                id="ngo-pancard-document"
                                className="hidden"
                                name="panCard"
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="ngo-pancard-document"
                                className="inline-flex cursor-pointer gap-4 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-fit border 
                             border border-primary/20 shadow-xl shadow-black/10  hover:bg-primary/30"
                            >
                                Browse File
                            </label>
                        </div>
                    </div>
                </div>
                <div className="max-w-[650px] flex gap-1 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-full border 
                             border border-primary/20 shadow-xl shadow-black/10
                             justify-between items-center hover:bg-tertiary transition-all duration-300">
                    <div className="flex gap-4">
                        <div className="p-3 rounded-md bg-background/90">
                            <img src="/src/assets/location.png" alt="" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-md font-bold">Address Proof</h1>
                            <h1 className="text-inactive/70 text-sm">Required • PDF, JPG, PNG</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="text-secondary/70">
                                {formData.addressProof
                                    ? formData.addressProof.name
                                    : "No file selected"}
                            </span>
                            {errors.addressProof && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.addressProof}
                                </p>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                id="ngo-address-document"
                                className="hidden"
                                name="addressProof"
                                onChange={handleChange}
                                required
                            />
                            <label
                                htmlFor="ngo-address-document"
                                className="inline-flex cursor-pointer gap-4 text-inactive px-4 py-3 bg-background/20
                             backdrop-blur-xl rounded-[8px] w-fit border 
                             border border-primary/20 shadow-xl shadow-black/10  hover:bg-primary/30"
                            >
                                Browse File
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}