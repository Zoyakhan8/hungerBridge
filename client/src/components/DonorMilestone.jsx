export const DonorMilestone = ({ name, image, verify }) => {
    const verified = verify === true
        ? "Verified Donor"
        : "Verification Pending";

    return (
        <section className="flex h-full w-full min-w-0 flex-col justify-center gap-5 rounded-2xl border border-white/20 bg-gradient-to-br from-primary/15 via-brown to-brown px-4 py-6 text-inactive shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:shadow-xl sm:gap-6 sm:px-6 sm:py-8">
            {/* DONOR PROFILE */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-lg font-bold text-gray-700 ring-2 ring-primary sm:h-16 sm:w-16">
                    {image ? (
                        <img
                            src={image}
                            alt={name ? `${name}'s profile` : "Donor profile"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span aria-hidden="true">
                            {name?.trim()?.charAt(0)?.toUpperCase() || "D"}
                        </span>
                    )}
                </div>

                <div className="flex min-w-0 flex-col items-start gap-2">
                    <h2 className="max-w-full break-words font-app-heading text-xl font-bold capitalize text-heading sm:text-2xl">
                        {name || "Donor"}
                    </h2>

                    <span
                        className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium sm:text-sm ${
                            verify === true
                                ? "border-green-600/40 bg-green-500/10 text-green-700"
                                : "border-secondary/40 bg-secondary/10 text-secondary"
                        }`}
                    >
                        <span
                            className={`h-2 w-2 shrink-0 rounded-full ${
                                verify === true
                                    ? "bg-green-600"
                                    : "bg-secondary"
                            }`}
                        />
                        <span className="break-words">{verified}</span>
                    </span>
                </div>
            </div>

            {/* DONOR IMPACT */}
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4">
                <article className="flex min-w-0 flex-col gap-2 rounded-xl border border-secondary/40 bg-tertiary/70 p-3 sm:p-4">
                    <h3 className="break-words font-heading text-sm font-extrabold sm:text-base">
                        Total Impact
                    </h3>

                    <p className="break-words font-app-heading text-3xl font-bold text-secondary sm:text-4xl">
                        1.2k
                    </p>

                    <p className="text-xs font-medium leading-5 sm:text-sm">
                        Meals provided
                    </p>
                </article>

                <article className="flex min-w-0 flex-col gap-2 rounded-xl border border-secondary/40 bg-tertiary/70 p-3 sm:p-4">
                    <h3 className="break-words font-heading text-sm font-extrabold sm:text-base">
                        Active Streak
                    </h3>

                    <p className="font-app-heading text-3xl font-bold text-heading sm:text-4xl">
                        6
                    </p>

                    <p className="text-xs font-medium leading-5 sm:text-sm">
                        Months
                    </p>
                </article>
            </div>
        </section>
    );
};