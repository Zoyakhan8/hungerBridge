
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-tertiary">
            <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-4 lg:gap-8 lg:px-12 lg:py-16 xl:px-16">

                {/* Brand and mission */}
                <div className="flex min-w-0 flex-col gap-4 md:pr-4">
                    <Link to="/" className="w-fit">
                        <h2 className="font-heading text-3xl font-extrabold text-heading sm:text-4xl">
                            HungerBridge
                        </h2>
                    </Link>

                    <p className="max-w-sm font-body text-sm leading-relaxed text-inactive">
                        © 2026 HungerBridge. Dedicated to illuminating the
                        path toward zero hunger.
                    </p>
                </div>

                {/* Quick links */}
                <div className="flex min-w-0 flex-col items-start gap-4">
                    <h4 className="font-body text-sm font-semibold text-heading">
                        Quick Links
                    </h4>

                    <Link
                        to="/about"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        Project Story
                    </Link>

                    <Link
                        to="/"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        Impact Stats
                    </Link>

                    <Link
                        to="/"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        Technology
                    </Link>
                </div>

                {/* Project information */}
                <div className="flex min-w-0 flex-col items-start gap-4">
                    <h4 className="font-body text-sm font-semibold text-heading">
                        Project Info
                    </h4>

                    <Link
                        to="/"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        Academic Statistics
                    </Link>

                    <a
                        href="https://github.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        GitHub Repository
                    </a>

                    <Link
                        to="/"
                        className="font-body text-sm font-medium text-inactive transition-colors hover:text-primary"
                    >
                        Research Paper
                    </Link>
                </div>

                {/* Academic disclaimer */}
                <div className="flex min-w-0 flex-col items-start gap-4">
                    <h4 className="font-body text-sm font-semibold text-heading">
                        Academic Disclaimer
                    </h4>

                    <p className="font-body text-sm leading-relaxed text-inactive">
                        This project was developed as a Final Year Thesis
                        for the Bachelor of Science program. All rights
                        reserved by the respective research committee.
                    </p>
                </div>
            </div>

            {/* Bottom border and copyright */}
            <div className="border-t border-white/10 px-5 py-4 text-center sm:px-8">
                <p className="font-body text-xs text-inactive/70 sm:text-sm">
                    Built with purpose. Working toward a world with less
                    food waste and zero hunger.
                </p>
            </div>
        </footer>
    );
};
