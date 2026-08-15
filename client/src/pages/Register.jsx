import { NavLink } from "react-router-dom"
import { Feature } from "../components/Feature"
export const Register = () => {
    return (
        <div className="flex flex-col items-center gap-12 py-24 bg-brown">
            <div className="flex flex-col gap-2 items-center text-inactive gap-2">
                <h1 className="font-heading text-4xl font-extrabold">Choose Your Role</h1>
                <h1>Join our ecosystem to help illuminate the path toward zero hunger.</h1>
            </div>
            <div className="flex flex-row justify-center gap-6 w-[700px]">
                <div className="flex flex-1">
                    <NavLink to="/register-donor" >
                        <div className=" flex flex-col gap-4 items-center text-inactive p-10
                        bg-background/20 backdrop-blur-xl rounded-[20px] min-w-[250px] max-w-fit border border border-white/20
                        shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/15 
                        hover:border-white/30 hover:shadow-2xl hover:scale-102 hover:-translate-y-2">
                            <div className="p-4 rounded-full bg-secondary/30">
                                <img src="/src/assets/RegisterDonor.png" alt="" />
                            </div>
                            <div className="font-heading font-extrabold text-3xl ">
                                Donor</div>
                            <div className="font-body text-medium text-inactive/70">
                                I want to contribute resources,
                                surplus food support to those in need.</div>
                        </div>
                    </NavLink>
                </div>
                <div className="flex flex-1">
                    <NavLink to="/register-ngo" >
                        <div className=" flex flex-col gap-4 items-center text-inactive p-10
                        bg-background/20 backdrop-blur-xl rounded-[20px] min-w-[250px] max-w-fit border border border-white/20
                        shadow-xl shadow-black/10 transition-all duration-300 hover:bg-white/15 
                        hover:border-white/30 hover:shadow-2xl hover:scale-102 hover:-translate-y-2">
                            <div className="p-4 rounded-full bg-primary/40">
                                <img src="/src/assets/NGO.png" alt="" />
                            </div>
                            <div className="font-heading font-extrabold text-3xl ">
                                NGO</div>
                            <div className="font-body text-medium text-inactive/70">
                                We are an organization dedicated
                                to distributing resources and managing hunger relief programs.</div>
                        </div>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}