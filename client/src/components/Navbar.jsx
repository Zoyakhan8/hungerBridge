import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png"
export const Navbar = () => {
    return (
        <header>
            <nav className="p-6 flex justify-between bg-background items-center">
                <div className="flex gap-2 items-center">
                    <img src={logo} alt="logo" width="48" />
                    <h3 className="font-heading font-extrabold text-3xl text-heading">HungerBridge</h3>
                </div>
                <ul className="font-heading flex gap-8 font-bold text-xl text-inactive items-center">
                    <li><NavLink to="/"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>
                        Home</NavLink></li>
                    <li><NavLink to="/about"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>About</NavLink></li>
                    <li><NavLink to="/contact-us"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>Contact</NavLink></li>
                    <li><NavLink to="/login"
                        className="inline-block text-body backdrop-blur-3xl px-4 py-1 shadow-[0_4px_20px] shadow-primary/50
                            bg-primary border border-white/20 text-brown rounded-[10px] text-xl font-extrabold
                            hover:shadow-[0_4px_30px] shadow-primary/50 hover:scale-105 transition-all duration-300"
                    >Log In</NavLink></li>
                </ul>
            </nav>
        </header>
    )
}