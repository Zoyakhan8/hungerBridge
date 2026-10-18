export const Message = ({ type, title, message, onClose }) => {
    const isSuccess = type === "success";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="message-title"
                aria-describedby="message-description"
                className="w-full max-w-md min-w-0 rounded-2xl border border-white/20 bg-brown p-5 shadow-2xl sm:p-7"
                onClick={(event) => event.stopPropagation()}
            >
                {/* Status indicator */}
                <div className="mb-4 flex justify-center">
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold ${
                            isSuccess
                                ? "bg-green-500/15 text-green-500"
                                : "bg-red-500/15 text-red-400"
                        }`}
                        aria-hidden="true"
                    >
                        {isSuccess ? "✓" : "!"}
                    </div>
                </div>

                {/* Title */}
                <h2
                    id="message-title"
                    className="break-words text-center font-app-heading text-xl font-bold text-heading sm:text-2xl"
                >
                    {title}
                </h2>

                {/* Message */}
                <p
                    id="message-description"
                    className="mt-3 whitespace-pre-line break-words text-center text-sm leading-6 text-inactive sm:text-base"
                >
                    {message}
                </p>

                {/* Action */}
                <button
                    type="button"
                    onClick={onClose}
                    autoFocus
                    className="mt-6 min-h-12 w-full rounded-xl border border-white/20 bg-primary px-4 py-3 font-semibold text-background transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-brown"
                >
                    OK
                </button>
            </div>
        </div>
    );
};