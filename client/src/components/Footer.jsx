export const Footer = () => {
    return (
        <footer className="flex bg-background p-24 justify-evenly items-center gap-8">
            <div className=" flex flex-col items-center gap-4 w-[360px] p-4">
                <h2 className="font-heading font-extrabold text-4xl text-heading">HungerBridge</h2>
                <h4 className="font-body text-sm text-inactive">© 2026 HungerBridge.
                    Dedicated to illuminating
                    the path toward zero hunger.</h4>
            </div>
            <div className="flex flex-col justify-center gap-6 w-[200px]">
                <h4 className="font-body text-sm font-semibold text-heading">Quick Links</h4>
                <a href="/" className="font-body text-sm font-medium text-inactive">Project Story</a>
                <a href="/" className="font-body text-sm font-medium text-inactive">Impact Stats</a>
                <a href="/" className="font-body text-sm font-medium text-inactive">Technology</a>
            </div>
            <div className="flex flex-col justify-center gap-6 w-[200px]">
                <h4 className="font-body text-sm font-semibold text-heading">Project Info</h4>
                <a href="/" className="font-body text-sm font-medium text-inactive">Academic Statistics</a>
                <a href="/" className="font-body text-sm font-medium text-inactive">GitHub Repository</a>
                <a href="/" className="font-body text-sm font-medium text-inactive">Research Paper</a>
            </div>
            <div className="flex flex-col justify-center gap-6 w-[360px]">
                <h4 className="font-body text-sm font-semibold text-heading">Academic Disclaimer</h4>
                <h4 className="font-body text-sm font-medium text-inactive">This project was developed as a Final Year Thesis
                    for the Bachelor of Science program.
                    All rights reserved by the respective
                    research committee.
                </h4>
            </div>
        </footer>
    )
}