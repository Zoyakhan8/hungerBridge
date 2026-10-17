import { NavLink } from "react-router-dom";
import { DonationForm } from "../components/DonationForm"
import { DonorMilestone } from "../components/DonorMilestone"
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LeaderboardCard } from "../components/LeaderboardCard";
import { useEffect, useState } from "react";
import addDonation from "../assets/addDonation.png"
import { Message } from "../components/Message";
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
            const res = await fetch("/api/donor/dashboard", {
                credentials: "include",
            });
            const data = await res.json();
            if (res.ok) {
                setDonor(data);
            }
        };
        getDashboard();
    }, []);
    return (
        <div className="bg-brown flex flex-col gap-6 p-12">
            <div className="flex flex-col justify-center gap-4 ">
                <h1 className="text-heading text-5xl font-app-heading font-extrabold">Welcome back,{donor?.donorName}</h1>
                <p className="text-inactive/90 text-md font-body font-medium ">Your contributions have provided 450 meals this month.</p>
            </div>
            <div className="flex flex-row gap-6">
                <div className="flex flex-col justify-center gap-6">
                    <DonorMilestone
                        name={donor?.donorName}
                        image={donor?.photoUrl}
                        verify={donor?.verified}
                    />
                    <div className="flex flex-col justify-center gap-4
                    flex gap-2 flex-col h-full gap-4 justify-center text-inactive
                    py-8 px-4
                    bg-gradient-to-bl from-secondary/8 via-brown to-brown
                    backdrop-blur-xl rounded-[20px] min-w-[400px]
                    border border-white/20
                    shadow-lg shadow-black/10
                    transition-all duration-300
                    hover:border-white/30 hover:shadow-2xl hover:scale-101">
                        <div className="flex flex-row gap-4">
                            <img src={addDonation} alt="" />
                            <h1 className="text-heading text-2xl font-app-heading font-bold">New Donation</h1>
                        </div>
                        <DonationForm
                            onMessage={(data) => {
                                setMessageData(data);
                                setShowMessage(true);
                            }} />
                    </div>
                </div>
                <div className="flex flex-col gap-6 min-w-[1000px]">
                    <div className="flex flex-col gap-6 p-6 bg-background/20
                backdrop-blur-xl rounded-[8px] min-h-[60%] max-h
                    border border-white/20 
                    shadow-lg shadow-black/10">
                        <div className="flex justify-between">
                            <h1 className="text-heading text-3xl font-app-heading font-extrabold">Recent Activity</h1>
                            <NavLink to="/donor/donations" className="text-secondary/80 text-lg font-body font-bold flex items-center gap-2 cursor-pointer">
                                View All<ArrowRight strokeWidth={3.5} size={20} />
                            </NavLink>
                        </div>
                        <table className="border-separate border-spacing-y-2 text-center p-4 align-middle ">
                            <thead className="[&_tr:last-child_td]:border-b-0</thead">
                                <tr className="font-app-heading text-table uppercase  text-lg [&>th]:border-b-2 [&>th]:border-secondary/60">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Food Name</th>
                                    <th className="p-3">Quantity</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Impact</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child_td]:border-b-0</tbody ">
                                <tr className="font-app-heading text-table capitalize font-medium text-md [&>td]:border-b-2 [&>td]:border-secondary/60">
                                    <td className="p-2">12/2</td>
                                    <td className="p-2">biryani</td>
                                    <td className="p-2">10</td>
                                    <td className="p-2">
                                        <span className="inline-flex items-center gap-2 rounded-full bg-tertiary px-3 py-1 font-code text-xs">
                                            <span className="h-2 w-2 rounded-full bg-primary" />
                                            Delivered
                                        </span>
                                    </td>
                                    <td className="text-primary p-2 font-bold">~200 meals</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-tertiary/50 flex flex-col gap-6 p-6
                backdrop-blur-xl rounded-[8px] min-h-[20%] 
                    border border-white/20
                    shadow-lg shadow-black/10">
                        <div className="flex justify-between">
                            <h1 className="text-heading text-3xl font-app-heading font-extrabold">Local Champions</h1>
                            <span className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-1 font-code text-xs">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                This Month
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                            <LeaderboardCard />
                            <LeaderboardCard />
                            <LeaderboardCard />
                        </div>
                    </div>
                </div>
            </div >
            {
                showMessage && (
                    <Message
                        {...messageData}
                        onClose={() => setShowMessage(false)}
                    />
                )
            }
        </div >
    )
}