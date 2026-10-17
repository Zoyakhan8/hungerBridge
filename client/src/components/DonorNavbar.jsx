import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png"
export const DonorNavbar = () => {
    return (
        <header>
            <nav className="p-4 flex justify-between bg-background items-center">
                <div className="flex gap-2 items-center">
                    <img src={logo} alt="logo" width="32" />
                    <h3 className="font-heading font-extrabold text-2xl text-heading">HungerBridge</h3>
                </div>
                <ul className="font-heading flex gap-8 font-bold text-lg text-inactive items-center">
                    <li><NavLink to="/donor/dashboard"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>
                        Dashboard</NavLink></li>
                    <li><NavLink to="/donor/donations"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>Donations</NavLink></li>
                    <li><NavLink to="/donor/community"
                        className={({ isActive }) =>
                            `inline-block transition-all duration-300 ${isActive
                                ? "text-heading underline underline-offset-8 decoration-2 decoration-primary"
                                : "hover:text-primary hover:-translate-y-1"
                            }`
                        }>Community</NavLink></li>
                    <li>
                        <NavLink
                            to="/donor/profile-setup"
                            className={({ isActive }) =>
                                `flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300
                            ${isActive
                                    ? "ring-2 ring-primary"
                                    : "hover:ring-2 hover:ring-primary"
                                }`
                            }
                        >
                            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-700">
                                P
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}