import { NavLink } from "react-router-dom"

export const Navbar = () => {
    return (
        <header>
            <nav className="p-6 flex  justify-between bg-background">
                <h3 className="font-heading font-extrabold text-3xl text-heading">HungerBridge</h3>
                <ul className="font-heading flex gap-8 font-bold text-xl text-inactive items-center">
                    <li><NavLink to="/"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8"
                                : "text-inactive hover:text-heading hover:-translate-y-1"
                            }`
                        }>
                        Home</NavLink></li>
                    <li><NavLink to="/about"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading"
                                : "text-inactive hover:text-heading hover:-translate-y-1"
                            }`
                        }>About</NavLink></li>
                    <li><NavLink to="/contact-us"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading"
                                : "text-inactive hover:text-heading hover:-translate-y-1"
                            }`
                        }>Contact</NavLink></li>
                    <li><NavLink to="/login"
                        className="inline-block text-body backdrop-blur-3xl px-4 py-1 shadow-[0_4px_20px] shadow-primary/50
                            bg-gradient-to-r from-primary/90 from-30 via-primary/80 to-inactive/75 to-70
                            border border-white/20 text-brown rounded-[10px] text-xl font-extrabold
                            hover:shadow-[0_4px_30px] shadow-primary/50 hover:scale-105 transition-all duration-300"
                    >Log In</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}