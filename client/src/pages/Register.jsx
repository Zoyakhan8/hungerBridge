import { NavLink } from "react-router-dom";
import { Feature } from "../components/Feature";

export const Register = () => {
    return (
        <main className="min-h-screen overflow-x-hidden bg-brown px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10 lg:gap-12">

                {/* Page heading */}
                <div className="flex w-full flex-col items-center gap-3 text-center text-inactive">
                    <h1 className="font-heading text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                        Choose Your Role
                    </h1>

                    <p className="max-w-2xl text-sm leading-6 text-inactive/80 sm:text-base sm:leading-7">
                        Join our ecosystem to help illuminate the path toward zero hunger.
                    </p>
                </div>

                {/* Role cards */}
                <div className="grid w-full grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">

                    {/* Donor card */}
                    <NavLink
                        to="/register-donor"
                        className="group flex min-w-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brown"
                    >
                        <div className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-white/20 bg-background/20 p-6 text-center text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl sm:p-8 lg:p-10">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary/30 p-4 sm:h-24 sm:w-24">
                                <img
                                    src="/src/assets/RegisterDonor.png"
                                    alt="Donor"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
                                Donor
                            </h2>

                            <p className="max-w-sm text-sm leading-6 text-inactive/70 sm:text-base sm:leading-7">
                                I want to contribute resources, surplus food support to those in need.
                            </p>
                        </div>
                    </NavLink>

                    {/* NGO card */}
                    <NavLink
                        to="/register-ngo"
                        className="group flex min-w-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brown"
                    >
                        <div className="flex w-full min-w-0 flex-col items-center gap-4 rounded-2xl border border-white/20 bg-background/20 p-6 text-center text-inactive shadow-xl shadow-black/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/15 hover:shadow-2xl sm:p-8 lg:p-10">
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/40 p-4 sm:h-24 sm:w-24">
                                <img
                                    src="/src/assets/NGO.png"
                                    alt="NGO"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">
                                NGO
                            </h2>

                            <p className="max-w-sm text-sm leading-6 text-inactive/70 sm:text-base sm:leading-7">
                                We are an organization dedicated to distributing resources and managing hunger relief programs.
                            </p>
                        </div>
                    </NavLink>

                </div>
            </div>
        </main>
    );
};