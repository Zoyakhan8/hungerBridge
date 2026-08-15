export const DonorFormInput = ({
    label,
    name,
    type ,
    placeholder,
    value,
    onChange,
    error,
    required = false
}) => {
    return (
        <div className="flex flex-col gap-1 flex-1">
            <label
                htmlFor={name}
                className="font-heading text-md text-inactive font-bold"
            >
                {label} {required && "*"}
            </label>

            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`text-inactive px-4 py-3 bg-background/20
                    backdrop-blur-xl rounded-[8px] w-full border
                    shadow-xl shadow-black/10
                    ${
                        error
                            ? "border-red-500/70"
                            : "border-primary/20"
                    }`}
            />

            {error && (
                <span className="text-red-400 text-sm">
                    {error}
                </span>
            )}
        </div>
    );
};