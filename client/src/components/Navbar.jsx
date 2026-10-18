
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact-us" },
        { name: "Be a Partner", path: "/delivery/register" },
    ];

    const closeMenu = () => setMenuOpen(false);

    const linkClass = ({ isActive }) =>
        `block transition-all duration-300 ${
            isActive
                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                : "hover:text-primary lg:hover:-translate-y-1"
        }`;

    return (
        <header className="relative z-50 w-full bg-background">
            <nav className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 md:px-8 lg:px-12">

                {/* Logo */}
                <NavLink
                    to="/"
                    onClick={closeMenu}
                    className="flex shrink-0 items-center gap-2"
                >
                    <img
                        src={logo}
                        alt="HungerBridge logo"
                        className="h-9 w-9 object-contain sm:h-12 sm:w-12"
                    />

                    <span className="font-heading text-xl font-extrabold text-heading sm:text-2xl lg:text-3xl">
                        HungerBridge
                    </span>
                </NavLink>

                {/* Desktop navigation */}
                <ul className="hidden items-center gap-5 font-heading text-base font-bold text-inactive lg:flex xl:gap-8 xl:text-lg">
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                className={linkClass}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <NavLink
                            to="/login"
                            className="inline-block rounded-[10px] border border-white/20 bg-primary px-5 py-2 font-heading text-base font-extrabold text-brown shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl xl:text-lg"
                        >
                            Log In
                        </NavLink>
                    </li>
                </ul>

                {/* Mobile menu toggle */}
                <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 text-heading transition-colors hover:bg-primary/10 lg:hidden"
                >
                    {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            <div
                id="mobile-navigation"
                className={`absolute left-0 right-0 top-full border-t border-primary/15 bg-background px-5 shadow-xl transition-all duration-300 lg:hidden ${
                    menuOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-2 opacity-0 pointer-events-none"
                }`}
            >
                <ul className="flex flex-col gap-1 py-3 font-heading text-base font-bold text-inactive sm:text-lg">
                    {links.map((link) => (
                        <li key={link.path}>
                            <NavLink
                                to={link.path}
                                onClick={closeMenu}
                                className={({ isActive }) =>
                                    `block rounded-lg px-4 py-3 transition-colors ${
                                        isActive
                                            ? "bg-primary/10 text-heading"
                                            : "hover:bg-primary/5 hover:text-primary"
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}

                    <li className="pt-2">
                        <NavLink
                            to="/login"
                            onClick={closeMenu}
                            className="block w-full rounded-[10px] bg-primary px-4 py-3 text-center font-extrabold text-brown shadow-md shadow-primary/20 transition-transform hover:scale-[1.02]"
                        >
                            Log In
                        </NavLink>
                    </li>
                </ul>
            </div>
        </header>
    );
};
