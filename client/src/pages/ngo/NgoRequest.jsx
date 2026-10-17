
import { useEffect, useState } from "react";
import {
    Check,
    X,
    Clock3,
    Package,
    CalendarDays,
    MapPin,
    Inbox,
} from "lucide-react";

import {
    NgoSideBar,
    DEFAULT_NGO_NAVIGATION,
} from "./NgoSidebar";

import { NgoHeader } from "./NgoHeader";

const API_URL = "http://localhost:3000/api";

const statusStyles = {
    Pending: "bg-amber-50 text-amber-700",
    Accepted: "bg-green-50 text-green-700",
    Rejected: "bg-red-50 text-red-700",
};

export const NgoRequest = ({
    navigation = DEFAULT_NGO_NAVIGATION,
    onNavigate,
    onSearch,
}) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("All");
    const [processingId, setProcessingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/ngo/request`, {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Failed to fetch requests.");
                }

                const formattedRequests = (data.requests ?? []).map((item) => ({
                    id: item.requestId,
                    requester: "Food donor",
                    food: item.donation?.foodName ?? "Food donation",
                    quantity: item.donation?.quantity ?? "Not specified",
                    date: item.donation?.expectedExpiryTime
                        ? new Date(item.donation.expectedExpiryTime).toLocaleString()
                        : item.requestedAt
                            ? new Date(item.requestedAt).toLocaleDateString()
                            : "Not specified",
                    location: "Location not available",
                    description: item.donation?.ingredients
                        ? `Ingredients: ${item.donation.ingredients}`
                        : `Food type: ${item.donation?.foodType ?? "Not specified"}`,
                    status:
                        item.status?.toLowerCase() === "accepted"
                            ? "Accepted"
                            : ["declined", "rejected"].includes(item.status?.toLowerCase())
                                ? "Rejected"
                                : item.status?.toLowerCase() === "cancelled"
                                    ? "Cancelled"
                                    : "Pending",
                }));

                setRequests(formattedRequests);
            } catch (err) {
                console.error("Fetching NGO requests failed:", err);
                setError(err.message || "Could not load requests.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleNavigate = (label) => {
        setMobileOpen(false);
        onNavigate?.(label);
    };

    const updateRequest = async (id, status) => {
        if (status === "Rejected") {
            const confirmed = window.confirm(
                "Are you sure you want to reject this request?"
            );

            if (!confirmed) return;
        }

        try {
            setProcessingId(id);
            setError("");
            setNotice("");

            const response = await fetch(
                `${API_URL}/ngo/request/${id}/status`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: status.toLowerCase(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Could not update request.");
            }

            setRequests((current) =>
                current.map((request) =>
                    request.id === id ? { ...request, status } : request
                )
            );

            setNotice(`Request ${status.toLowerCase()} successfully.`);
        } catch (err) {
            console.error("Updating request failed:", err);
            setError(err.message || "Could not update request.");
        } finally {
            setProcessingId(null);
        }
    };

    const filteredRequests =
        filter === "All"
            ? requests
            : requests.filter((request) => request.status === filter);

    const pendingCount = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    return (
        <div className="min-h-screen bg-[#FBF9F1] text-[#2D3436]">
            <div className="mx-auto flex min-h-screen max-w-[1600px] overflow-hidden bg-[#FBF9F1] shadow-[0_12px_35px_rgba(48,40,20,0.08)]">
                <NgoSideBar
                    items={navigation}
                    mobileOpen={mobileOpen}
                    onNavigate={handleNavigate}
                />

                <div className="min-w-0 flex-1">
                    <NgoHeader
                        onMenuClick={() => setMobileOpen((open) => !open)}
                        onSearch={onSearch}
                    />

                    <main className="min-h-screen bg-brown p-5 font-body text-heading md:p-10">
                        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="mb-2 font-app-body text-xs uppercase tracking-[0.18em] text-primary">
                                    NGO Dashboard
                                </p>
                                <h1 className="font-app-heading text-2xl font-bold md:text-3xl">
                                    Incoming Requests
                                </h1>
                                <p className="mt-2 text-sm text-[#78695E]">
                                    Review requests and decide whether to accept or reject them.
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-3 rounded-xl border border-[#EEEAE0] bg-white px-4 py-3">
                                <div className="grid h-10 w-10 place-items-center rounded-lg bg-orange-50 text-primary">
                                    <Inbox size={21} />
                                </div>
                                <div>
                                    <p className="text-xs text-[#78695E]">Pending requests</p>
                                    <p className="text-xl font-bold">{pendingCount}</p>
                                </div>
                            </div>
                        </header>

                        {loading && (
                            <p className="mb-4 text-sm text-[#78695E]">
                                Loading donation requests...
                            </p>
                        )}

                        {error && (
                            <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        {notice && (
                            <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                {notice}
                            </p>
                        )}

                        <div className="mb-6 flex flex-wrap gap-2">
                            {["All", "Pending", "Accepted", "Rejected"].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setFilter(status)}
                                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${filter === status
                                            ? "bg-primary text-white"
                                            : "border border-[#E8E2D8] bg-white text-[#65564C] hover:bg-[#F0EEE5]"
                                        }`}
                                >
                                    {status}
                                    {status === "Pending" && ` (${pendingCount})`}
                                </button>
                            ))}
                        </div>

                        <section
                            aria-label="Incoming requests"
                            className="grid grid-cols-1 gap-5 xl:grid-cols-2"
                        >
                            {filteredRequests.map((request) => (
                                <article
                                    key={request.id}
                                    className="rounded-2xl border border-[#EEEAE0] bg-white p-5 shadow-sm md:p-6"
                                >
                                    <div className="mb-5 flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#FFF0E7] text-primary">
                                                <Package size={23} />
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="font-app-heading text-base font-bold">
                                                    {request.food}
                                                </h2>
                                                <p className="mt-1 text-sm text-[#78695E]">
                                                    From {request.requester}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                                        >
                                            {request.status}
                                        </span>
                                    </div>

                                    <p className="mb-5 text-sm leading-6 text-[#65564C]">
                                        {request.description}
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 rounded-xl bg-[#FBF9F1] p-4 sm:grid-cols-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package size={16} className="shrink-0 text-primary" />
                                            <span>
                                                <span className="text-[#78695E]">Quantity: </span>
                                                <strong>{request.quantity}</strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarDays size={16} className="shrink-0 text-primary" />
                                            <span>{request.date}</span>
                                        </div>

                                        <div className="flex items-start gap-2 text-sm sm:col-span-2">
                                            <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                                            <span>{request.location}</span>
                                        </div>
                                    </div>

                                    {request.status === "Pending" ? (
                                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                            <button
                                                type="button"
                                                disabled={processingId === request.id}
                                                onClick={() => updateRequest(request.id, "Accepted")}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <Check size={17} />
                                                {processingId === request.id ? "Please wait..." : "Accept"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={processingId === request.id}
                                                onClick={() => updateRequest(request.id, "Rejected")}
                                                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <X size={17} />
                                                Reject
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-5 flex items-center gap-2 border-t border-[#EEEAE0] pt-4 text-sm text-[#78695E]">
                                            {request.status === "Accepted" ? (
                                                <Check size={17} className="text-green-600" />
                                            ) : (
                                                <Clock3 size={17} className="text-red-500" />
                                            )}
                                            Request {request.status.toLowerCase()}.
                                        </div>
                                    )}
                                </article>
                            ))}
                        </section>

                        {!loading && filteredRequests.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-[#DDD5C9] bg-white/70 px-6 py-16 text-center">
                                <Inbox size={34} className="mx-auto mb-3 text-[#A99A8B]" />
                                <h2 className="font-app-heading text-lg font-semibold">
                                    No {filter.toLowerCase()} requests
                                </h2>
                                <p className="mt-2 text-sm text-[#78695E]">
                                    Requests matching this status will appear here.
                                </p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default NgoRequest;
