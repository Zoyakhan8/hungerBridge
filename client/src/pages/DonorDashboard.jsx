import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { DonationForm } from "../components/DonationForm";
import { DonorMilestone } from "../components/DonorMilestone";
import { LeaderboardCard } from "../components/LeaderboardCard";
import { Message } from "../components/Message";

import addDonation from "../assets/addDonation.png";

export const DonorDashboard = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [messageData, setMessageData] = useState({
        type: "",
        title: "",
        message: "",
    });
    const [donor, setDonor] = useState(null);

    useEffect(() => {
        const getDashboard = async () => {
            try {
                const res = await fetch("/api/donor/dashboard", {
                    credentials: "include",
                });

                const data = await res.json();

                if (res.ok) {
                    setDonor(data);
                }
            } catch (error) {
                console.error("Failed to load donor dashboard:", error);
            }
        };

        getDashboard();
    }, []);

    return (
        <main className="min-w-0 w-full bg-brown p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="mx-auto flex w-full min-w-0 max-w-[1800px] flex-col gap-6 sm:gap-8">

                {/* PAGE HEADER */}
                <header className="flex min-w-0 flex-col gap-3">
                    <h1 className="break-words font-app-heading text-2xl font-extrabold text-heading sm:text-3xl lg:text-4xl">
                        Welcome back{donor?.donorName ? `, ${donor.donorName}` : ""}!
                    </h1>

                    <p className="text-sm font-medium leading-6 text-inactive/90 sm:text-base">
                        Your contributions have provided 450 meals this month.
                    </p>
                </header>

                {/* DASHBOARD CONTENT */}
                <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(320px,0.85fr)_minmax(0,2fr)]">

                    {/* LEFT COLUMN */}
                    <aside className="flex min-w-0 flex-col gap-6">
                        {/* DONOR MILESTONE */}
                        <div className="min-w-0">
                            <DonorMilestone
                                name={donor?.donorName}
                                image={donor?.photoUrl}
                                verify={donor?.verified}
                            />
                        </div>

                        {/* NEW DONATION */}
                        <section className="flex min-w-0 flex-col gap-5 rounded-2xl border border-white/20 bg-gradient-to-bl from-secondary/8 via-brown to-brown px-4 py-6 text-inactive shadow-lg shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:shadow-xl sm:gap-6 sm:px-6 sm:py-8">
                            <div className="flex min-w-0 items-center gap-3">
                                <img
                                    src={addDonation}
                                    alt=""
                                    aria-hidden="true"
                                    className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
                                />

                                <h2 className="min-w-0 break-words font-app-heading text-xl font-bold text-heading sm:text-2xl">
                                    New Donation
                                </h2>
                            </div>

                            <div className="min-w-0">
                                <DonationForm
                                    onMessage={(data) => {
                                        setMessageData(data);
                                        setShowMessage(true);
                                    }}
                                />
                            </div>
                        </section>
                    </aside>

                    {/* RIGHT COLUMN */}
                    <div className="flex min-w-0 flex-col gap-6">

                        {/* RECENT ACTIVITY */}
                        <section className="min-w-0 rounded-xl border border-white/20 bg-background/20 p-4 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-5 lg:p-6">
                            <div className="mb-4 flex min-w-0 flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="font-app-heading text-xl font-extrabold text-heading sm:text-2xl">
                                    Recent Activity
                                </h2>

                                <NavLink
                                    to="/donor/donations"
                                    className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md text-sm font-bold text-secondary/80 transition hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary sm:text-base"
                                >
                                    View All
                                    <ArrowRight strokeWidth={3} size={18} />
                                </NavLink>
                            </div>

                            {/* Responsive table wrapper */}
                            <div className="-mx-1 min-w-0 overflow-x-auto">
                                <table className="w-full min-w-[600px] border-separate border-spacing-y-2 text-center align-middle">
                                    <thead>
                                        <tr className="font-app-heading text-xs uppercase text-table sm:text-sm [&>th]:border-b-2 [&>th]:border-secondary/60">
                                            <th scope="col" className="p-3">
                                                Date
                                            </th>
                                            <th scope="col" className="p-3">
                                                Food Name
                                            </th>
                                            <th scope="col" className="p-3">
                                                Quantity
                                            </th>
                                            <th scope="col" className="p-3">
                                                Status
                                            </th>
                                            <th scope="col" className="p-3">
                                                Impact
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {donor?.recentDonations?.length > 0 ? (
                                            donor.recentDonations.map((donation) => (
                                                <tr
                                                    key={donation.id}
                                                    className="font-app-heading text-sm font-medium capitalize text-table sm:text-base [&>td]:border-b-2 [&>td]:border-secondary/60"
                                                >
                                                    <td className="whitespace-nowrap p-3">
                                                        {donation.createdAt
                                                            ? new Date(
                                                                  donation.createdAt
                                                              ).toLocaleDateString("en-IN")
                                                            : "—"}
                                                    </td>

                                                    <td className="max-w-48 break-words p-3">
                                                        {donation.foodName ?? "—"}
                                                    </td>

                                                    <td className="whitespace-nowrap p-3">
                                                        {donation.quantity ?? "—"}
                                                    </td>

                                                    <td className="p-3">
                                                        <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-tertiary px-3 py-1 font-code text-xs">
                                                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                                            {donation.status ?? "Unknown"}
                                                        </span>
                                                    </td>

                                                    <td className="whitespace-nowrap p-3 font-bold text-primary">
                                                        {donation.impact != null
                                                            ? `~${donation.impact} meals`
                                                            : "—"}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="p-6 text-sm leading-6 text-inactive sm:text-base"
                                                >
                                                    No donations yet. Your donations will appear here.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* LOCAL CHAMPIONS */}
                        <section className="min-w-0 rounded-xl border border-white/20 bg-tertiary/50 p-4 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-5 lg:p-6">
                            <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <h2 className="font-app-heading text-xl font-extrabold text-heading sm:text-2xl">
                                    Local Champions
                                </h2>

                                <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-background px-4 py-2 font-code text-xs sm:px-5">
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    This Month
                                </span>
                            </div>

                            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                                <div className="min-w-0">
                                    <LeaderboardCard />
                                </div>

                                <div className="min-w-0">
                                    <LeaderboardCard />
                                </div>

                                <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                                    <LeaderboardCard />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            {/* FEEDBACK MESSAGE */}
            {showMessage && (
                <Message
                    {...messageData}
                    onClose={() => setShowMessage(false)}
                />
            )}
        </main>
    );
};