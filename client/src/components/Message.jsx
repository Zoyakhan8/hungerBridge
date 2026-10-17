export const Message = ({ type, title, message, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-[420px] rounded-xl border border-white/20 bg-brown/40 backdrop-blur-xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-black/70 text-center underline">
                    {title}
                </h2>

                <p className="mt-3 text-white">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-lg bg-primary py-3 font-semibold text-background"
                >
                    OK
                </button>
            </div>
        </div>
    );
};