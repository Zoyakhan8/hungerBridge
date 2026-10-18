import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../assets/logo.png";

export const DonorNavbar = ({ donor }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const photoUrl = donor?.photoUrl;

    const navLinkClass = ({ isActive }) =>
        `block rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200 sm:text-base ${
            isActive
                ? "bg-primary/10 text-heading underline decoration-2 underline-offset-4 decoration-primary lg:bg-transparent lg:underline-offset-8"
                : "text-inactive hover:bg-primary/10 hover:text-primary lg:hover:bg-transparent"
        }`;

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background shadow-sm">
            <nav
                className="mx-auto flex min-h-16 w-full max-w-[1800px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:min-h-20 lg:px-8"
                aria-label="Donor navigation"
            >
                {/* BRAND */}
                <NavLink
                    to="/donor/dashboard"
                    onClick={closeMenu}
                    className="flex min-w-0 shrink items-center gap-2"
                    aria-label="HungerBridge dashboard"
                >
                    <img
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
                    />

                    <span className="truncate font-heading text-lg font-extrabold text-heading sm:text-xl lg:text-2xl">
                        HungerBridge
                    </span>
                </NavLink>

                {/* DESKTOP NAVIGATION */}
                <ul className="hidden items-center gap-3 font-heading lg:flex lg:gap-5 xl:gap-8">
                    <li>
                        <NavLink
                            to="/donor/dashboard"
                            end
                            className={navLinkClass}
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/donor/donations"
                            className={navLinkClass}
                        >
                            Donations
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/donor/community"
                            className={navLinkClass}
                        >
                            Community
                        </NavLink>
                    </li>

                    <li className="ml-1">
                        <NavLink
                            to="/donor/profile-setup"
                            aria-label="Donor profile"
                            title="Donor profile"
                            className={({ isActive }) =>
                                `flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-all duration-200 ${
                                    isActive
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                        : "hover:ring-2 hover:ring-primary"
                                }`
                            }
                        >
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt="Donor profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 font-bold text-gray-700">
                                    D
                                </span>
                            )}
                        </NavLink>
                    </li>
                </ul>

                {/* MOBILE MENU BUTTON */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-heading transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="donor-mobile-navigation"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* MOBILE NAVIGATION */}
            {menuOpen && (
                <div
                    id="donor-mobile-navigation"
                    className="border-t border-white/10 bg-background px-4 pb-4 pt-3 sm:px-6 lg:hidden"
                >
                    <ul className="mx-auto flex w-full max-w-[1800px] flex-col gap-2 font-heading">
                        <li>
                            <NavLink
                                to="/donor/dashboard"
                                end
                                onClick={closeMenu}
                                className={navLinkClass}
                            >
                                Dashboard
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/donor/donations"
                                onClick={closeMenu}
                                className={navLinkClass}
                            >
                                Donations
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/donor/community"
                                onClick={closeMenu}
                                className={navLinkClass}
                            >
                                Community
                            </NavLink>
                        </li>

                        <li>
                            <NavLink
                                to="/donor/profile-setup"
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-3 py-2 font-bold transition ${
                                        isActive
                                            ? "bg-primary/10 text-heading"
                                            : "text-inactive hover:bg-primary/10 hover:text-primary"
                                    }`
                                }
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-gray-700">
                                    {photoUrl ? (
                                        <img
                                            src={photoUrl}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>D</span>
                                    )}
                                </span>

                                <span>My Profile</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}
        </header>
    );
};