import { useEffect, useState } from "react"

export const DonorMilestone = ({ name ,image,verify}) => {
    const [verified, setVerified] = useState("");
    useEffect(()=>{
        if(verify===true){
            setVerified("Verified Donor")
        }else{
            setVerified("Verification Pending")
        }
    })
    return (
        <div>
            <div className="flex gap-2 flex-col h-full gap-4 justify-center text-inactive
                py-10 px-7
                bg-gradient-to-br from-primary/15 via-brown to-brown
                backdrop-blur-xl rounded-[20px] min-w-[400px]
                border border-white/20
                shadow-lg shadow-black/10
                transition-all duration-300
                hover:border-white/30 hover:shadow-2xl hover:scale-101">
                <div className="flex flex-row gap-4">
                    <div className="flex h-15 w-15 items-center justify-center rounded-full bg-gray-200 text-gray-700
                    transition-all duration-300 ring-2 ring-primary"
                    >
                        <img src={image} alt="" />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <h1 className="text-heading text-3xl font-app-heading font-bold capitalize">{name}</h1>
                        <h1 className="text-secondary text-md font-app-heading font-medium w-max
                    bg-secondary/20 px-2 py-1/2 rounded-xl border border-secondary">{verified}</h1>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1
                    p-3 bg-tertiary/70 border border-secondary/60 rounded-md">
                        <h1 className="text-md font-extrabold font-heading">Total Impacts</h1>
                        <p className="text-4xl font-bold font-app-heading text-secondary">1.2k</p>
                        <h2 className="text-sm font-medium font-body">Meals provided</h2>
                    </div>
                    <div className="flex flex-col gap-1
                    p-3 bg-tertiary/70 border border-secondary/60 rounded-md">
                        <h1 className="text-md font-extrabold font-heading">Active Streak</h1>
                        <p className="text-4xl font-bold font-app-heading text-black">6</p>
                        <h2 className="text-sm font-medium font-body">Months</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}