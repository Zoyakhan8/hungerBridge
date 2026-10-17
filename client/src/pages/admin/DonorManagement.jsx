import { ArrowLeft, ArrowRight } from "lucide-react"
import filter from "../../assets/Filter.png"
import monthAvg from "../../assets/monthlyAvg.png"
import impact from "../../assets/impact.png"
import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { AdminHeader } from "./AdminHeader"
import {
    AdminSidebar,
    DEFAULT_ADMIN_NAVIGATION,
} from "./AdminSidebar";
export const DonorManagement = () => {
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleNavigate = () => {
        setMobileOpen(false);
    };
    useEffect(() => {
        const getDashboard = async () => {
            const res = await fetch(
                `/api/admin/donor-management?page=${page}`,
                {
                    credentials: "include",
                }
            );

            const result = await res.json();

            if (res.ok) {
                setData(result);
                console.log(result)
                if (result.donors.length > 0) {
                    setSelectedDonor(result.donors[0]);
                }
            }
        };

        getDashboard();
    }, [page]);
    const handleVerification = async (id, status) => {
        try {
            console.log(id, status)
            const res = await fetch(`http://localhost:3000/api/admin/donors/${id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                })
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className="min-h-screen bg-brown md:flex">
            <AdminSidebar
                items={DEFAULT_ADMIN_NAVIGATION}
                mobileOpen={mobileOpen}
                onNavigate={handleNavigate}
            />

            <main className="min-w-0 flex-1">
                <AdminHeader
                    onMenuClick={() => setMobileOpen((open) => !open)}
                    searchPlaceholder="Search NGOs..."
                />

                <div className="flex flex-col gap-6">
                    <div className="bg-brown flex flex-col p-6">
                        <div className="flex flex-col justify-center gap-6 w-[600px]">
                            <h1 className="text-heading text-5xl font-app-heading font-extrabold">Donor Management</h1>
                            <p className="text-inactive/90 text-md font-body font-medium ">
                                Review and manage registered food donors.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-6 min-w-[60%]">
                                <div className="flex gap-4 items-center border-2 border-secondary/15 py-4 px-2 rounded-lg">
                                    <div className="p-2">
                                        <img src={filter} alt="" />
                                    </div>
                                    <div className="bg-tertiary/80 py-1 px-6 border-2 border-secondary/15 rounded-full font-app-heading font-medium text-sm">
                                        <select>
                                            <option value="All">All Times</option>
                                            <option value="ThisYear">This Year</option>
                                            <option value="6Months">6 months</option>
                                            <option value="Custom">Custom</option>
                                        </select>
                                    </div>
                                    <div className="bg-tertiary/80 py-1 px-6 border-2 border-secondary/15 rounded-full font-app-heading font-medium text-sm">
                                        <select >
                                            <option value="All">All Type</option>
                                            <option value="Veg">Veg</option>
                                            <option value="Non Veg">Non Veg</option>
                                            <option value="Non-Pershiable">Non Pershiable</option>
                                        </select>
                                    </div>
                                    <div className="bg-tertiary/80 py-1 px-6 border-2 border-secondary/15 rounded-full font-app-heading font-medium text-sm">
                                        <select>
                                            <option value="All">All Statuses</option>
                                            <option value="Pending">Delivered</option>
                                            <option value="Accepted">In-transit</option>
                                            <option value="Delivered">Processed</option>
                                        </select>
                                    </div>
                                </div>
                                <div
                                    className="flex flex-col  gap-4 capitalize 
                            font-app-heading text-md rounded-lg bg-brown 
                            border border-secondary/30 cursor-pointer transition-all">
                                    <div className="flex justify-between px-6 py-3 items-center text-center font-app-body text-lg font-semibold bg-tertiary rounded">
                                        <div className="font-extrabold">Donor Roster</div>
                                        <div>
                                            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary px-3 py-1 text-sm">
                                                {data?.total} Total
                                            </span>
                                        </div>
                                    </div>
                                    {data?.donors.map((donor) => (
                                        <div
                                            key={donor.publicId}
                                            onClick={() => setSelectedDonor(donor)}
                                            className={`flex px-6 gap-4 py-4 capitalize items-center  font-app-heading text-md
                                hover:bg-tertiary rounded-lg bg-brown m-6 border border-secondary/30 
                                ${selectedDonor?.publicId === donor.publicId
                                                    ? "bg-tertiary"
                                                    : "bg-brown"
                                                }`}>
                                            <div className="flex  h-15 w-15 items-center justify-center rounded-full bg-gray-200 text-gray-700
                                transition-all duration-300 ring-2 ring-primary"
                                            >
                                                <img src={donor.photoUrl} alt={donor.name} />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 px-4">
                                                <h1 className="text-heading text-xl font-app-heading font-bold capitalize">{donor.name}</h1>
                                                <h1 className="text-heading/70 text-sm font-app-heading font-medium w-[150px]">{donor.shopName}</h1>
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 ">
                                                <span className="inline-flex text-primary items-center gap-2 font-bold rounded-full bg-tertiary px-3 py-1 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-primary " />
                                                    {donor.verifyStatus == "approved" ? "Verified" : "Not Verified"}
                                                </span>
                                                <span className="inline-flex items-center gap-2 text-heading/80 font-medium px-3 py-1 text-xs">
                                                    Join at 2hr
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 flex items-center justify-between gap-6 font-app-body">
                                    <button
                                        onClick={() => setPage((prev) => prev - 1)}
                                        disabled={page === 1}
                                        className="rounded-md border-2 border-secondary/20 px-4 py-2 text-sm
                            hover:bg-secondary/10 flex items-center gap-2 text-secondary/80 font-bold text-lg
                            disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ArrowLeft strokeWidth={3.5} size={20} /> Previous
                                    </button>

                                    <span className="text-md font-medium inline-flex gap-2 items-center">
                                        -- Page
                                        <span className="text-md text-brown font-bold bg-secondary/80 rounded-full px-3 py-1 ">
                                            {data?.page}
                                        </span> of {data?.totalPages} --
                                    </span>

                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        disabled={page === data?.totalPages}
                                        className="rounded-md border-2 border-secondary/20 px-4 py-2 text-sm
                             hover:bg-secondary/10 flex items-center gap-2 text-secondary/80 font-bold text-lg
                             disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Next <ArrowRight strokeWidth={3.5} size={20} />
                                    </button>
                                </div>
                            </div>
                            {selectedDonor && (
                                <div className="rounded-lg bg-tertiary min-w-[40%] border border-secondary/10 shadow-lg shadow-black/10 flex flex-col">
                                    <div className="flex flex-col p-4 gap-4 rounded-lg bg-brown shadow-lg shadow-black/10 ">
                                        <div className="shrink-0 flex px-6 gap-4 py-3 capitalize items-center  font-app-heading text-md">
                                            <div className="flex  h-15 w-15 items-center justify-center rounded-full bg-gray-200 text-gray-700
                    transition-all duration-300 ring-2 ring-primary"
                                            >
                                                <img src={selectedDonor.photoUrl} alt={selectedDonor.name} />
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 px-4">
                                                <h1 className="text-heading text-xl font-app-heading font-bold capitalize">{selectedDonor.name}</h1>
                                                <h1 className="text-heading/70 text-sm font-app-heading font-medium w-[150px]">{selectedDonor.shopName}</h1>
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 ">
                                                <span className="inline-flex text-primary items-center gap-2 font-bold rounded-full bg-tertiary px-3 py-1 text-sm">
                                                    <span className="h-2 w-2 rounded-full bg-primary " />
                                                    {selectedDonor.verifyStatus == "approved"
                                                        ? "Verified"
                                                        : "Not Verified"}
                                                </span>
                                                <span className="inline-flex items-center gap-2 text-heading/80 font-medium px-3 py-1 text-xs">
                                                    Join at 2hr
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center items-center gap-4 ">
                                            <div className="flex flex-col flex-1">
                                                <button
                                                    onClick={() => handleVerification(selectedDonor.publicId, "approved")}
                                                    className="rounded-md border-2 border-secondary/20 px-4 py-2 text-sm bg-secondary
                                        hover:bg-secondary/80 flex items-center justify-center gap-2
                                        text-brown font-bold text-lg"
                                                >
                                                    Approve
                                                </button>
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <button
                                                    onClick={() => handleVerification(selectedDonor.publicId, "rejected")}
                                                    className="flex items-center justify-center rounded-md border-2 border-secondary/20 px-4 py-2 text-sm 
                                        hover:bg-secondary/10 flex items-center gap-2 text-secondary/80 font-bold text-lg
                                        disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 overflow-y-auto">
                                        <div className="bg-brown shadow-lg shadow-black/10 p-4 m-4 rounded-lg flex-1 border-2 border-inactive/20">
                                            <p className="text-inactive/80 text-md font-app-heading font-bold uppercase border-b-2 border-b-inactive/10 px-2 text-center">
                                                Profile Details
                                            </p>
                                            <div className="flex gap-2 py-2 items-center font-app-heading">
                                                <h1 className="text-md text-inactive/80 font-bold">Contact :-</h1>
                                                <p className="text-sm text-inactive font-medium">{selectedDonor?.phoneNumber}</p>
                                            </div>
                                            <div className="flex gap-2 py-2 text-sm font-app-heading ">
                                                <h1 className="text-md text-inactive/80 font-bold">Address</h1>
                                                <p className="text-sm text-inactive font-medium">{selectedDonor?.shopAddress}</p>
                                            </div>
                                        </div>
                                        <div className="bg-brown shadow-lg shadow-black/10 p-4 m-4 rounded-lg flex-1 border-2 border-inactive/20">
                                            <p className="text-inactive/80 text-md font-app-heading font-bold uppercase border-b-2 border-b-inactive/10 px-2 text-center">
                                                Document Details
                                            </p>
                                            <div className="flex gap-2 justify-between px-4 py-2 bg-tertiary m-2 rounded-lg font-bold text-secondary border-2 border-secondary/20">
                                                <h1 className="text-inactive/95">Aadhar</h1>
                                                <a
                                                    href={selectedDonor?.aadharUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View
                                                </a>
                                            </div>
                                            <div className="flex gap-2 justify-between px-4 py-2 bg-tertiary m-2 rounded-lg font-bold text-secondary border-2 border-secondary/20">
                                                <h1 className="text-inactive/95">Shop License</h1>
                                                <a
                                                    href={selectedDonor?.shopLicenseUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    {selectedDonor?.approved ? (
                                        <div className="bg-brown py-2 px-4 m-4 rounded-lg border-2 border-secondary/10">
                                            <div className="flex justify-between border-b-2 border-b-inactive/20 py-2">
                                                <h1 className="text-heading text-md font-app-heading font-extrabold">Donation Activity</h1>
                                                <NavLink to="/admin/donations" className="text-secondary/80 text-sm font-body font-bold flex items-center gap-2 cursor-pointer">
                                                    View All<ArrowRight strokeWidth={3.5} size={20} />
                                                </NavLink>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 py-4">
                                                <div className="flex flex-col gap-1 group
                            p-3 bg-tertiary/70 border border-secondary/60 rounded-md hover:bg-secondary/10">
                                                    <h1 className="text-md font-extrabold font-heading">Total Donated</h1>
                                                    <p className="text-4xl font-bold font-app-heading group-hover:text-secondary text-primary">1.2k</p>
                                                </div>
                                                <div className="flex flex-col gap-1 group
                    p-3 bg-tertiary/70 border border-secondary/60 rounded-md hover:bg-secondary/10">
                                                    <h1 className="text-md font-extrabold font-heading">Total Quantity</h1>
                                                    <p className="text-4xl font-bold font-app-heading group-hover:text-secondary text-primary">1.2k</p>
                                                </div>
                                                <div className="flex flex-col gap-1 group
                    p-3 bg-tertiary/70 border border-secondary/60 rounded-md hover:bg-secondary/10">
                                                    <h1 className="text-md font-extrabold font-heading">Total Impacts</h1>
                                                    <p className="text-4xl font-bold font-app-heading group-hover:text-secondary text-primary">1.2k</p>
                                                </div>

                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-brown p-6 m-4 rounded-lg">
                                            <p className="text-inactive font-medium">
                                                Donation history is available after donor verification.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}